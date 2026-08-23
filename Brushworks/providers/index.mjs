// Brushworks provider-neutral adapter contract.
// Adapters describe capability and evidence requirements only. They never
// store credentials, never call providers, and never mark anything live.

export const ADAPTER_STATES = new Set(['stub', 'needs-credentials', 'configured', 'verified']);
export const ADAPTER_CATEGORIES = new Set(['hosting', 'domains', 'dns', 'ssl', 'storage', 'email', 'analytics', 'payments']);

function clean(value, fallback = '') {
  return String(value ?? fallback).trim().slice(0, 500);
}

export function createAdapter(input = {}) {
  const source = input && typeof input === 'object' ? input : {};
  const category = clean(source.category, 'hosting');
  return {
    id: clean(source.id, 'adapter'),
    name: clean(source.name, 'Provider adapter'),
    category: ADAPTER_CATEGORIES.has(category) ? category : 'hosting',
    state: ADAPTER_STATES.has(clean(source.state, 'stub')) ? clean(source.state, 'stub') : 'stub',
    capabilities: Array.isArray(source.capabilities) ? source.capabilities.map((item) => clean(item)).filter(Boolean) : [],
    evidenceRequired: Array.isArray(source.evidenceRequired) ? source.evidenceRequired.map((item) => clean(item)).filter(Boolean) : ['http-200', 'https-valid', 'dns-record'],
    writesExternal: false,
    storesSecrets: false,
    notes: clean(source.notes)
  };
}

export function listAdapters() {
  return [
    createAdapter({
      id: 'vercel-hosting',
      name: 'Vercel',
      category: 'hosting',
      capabilities: ['static-deploy', 'previews', 'custom-domains'],
      evidenceRequired: ['deployment-url', 'http-200', 'https-valid', 'project-id'],
      notes: 'Code-first delivery path. Deployment requires authenticated provider action (gated).'
    }),
    createAdapter({
      id: 'cloudrun-hosting',
      name: 'Google Cloud Run',
      category: 'hosting',
      capabilities: ['container-deploy', 'custom-domains', 'cloud-build'],
      evidenceRequired: ['service-url', 'http-200', 'https-valid', 'build-id'],
      notes: 'Cloud build currently blocked until APIs are enabled. No cloud writes from Brushworks.'
    }),
    createAdapter({
      id: 'registrar-domains',
      name: 'Registrar / Openprovider',
      category: 'domains',
      capabilities: ['domain-search', 'registration', 'renewal'],
      evidenceRequired: ['order-id', 'expiry-date', 'nameserver-record'],
      notes: 'Registration and renewal are irreversible billing actions. Approval-gated.'
    }),
    createAdapter({
      id: 'dns-zone',
      name: 'DNS provider',
      category: 'dns',
      capabilities: ['record-upsert', 'zone-read'],
      evidenceRequired: ['dns-record', 'propagation-check'],
      notes: 'DNS changes are irreversible external writes. Approval-gated with target evidence.'
    }),
    createAdapter({
      id: 'stripe-payments',
      name: 'Stripe',
      category: 'payments',
      capabilities: ['checkout', 'billing', 'connect'],
      evidenceRequired: ['checkout-session', 'webhook-signature', 'reconciliation-record'],
      notes: 'Checkout/Billing for one-time and subscriptions. Connect required for marketplace payouts.'
    })
  ];
}

export function providerMatrix() {
  return {
    generatedAt: new Date().toISOString(),
    boundary: 'adapters-describe-only',
    writesExternal: false,
    storesSecrets: false,
    adapters: listAdapters()
  };
}
