import type { AuditEvent, AuditOutcome } from '../contracts/audit';

export function createAuditEvent(input: Omit<AuditEvent, 'id' | 'occurredAt'>): AuditEvent {
  return { ...input, id: globalThis.crypto?.randomUUID?.() ?? `audit_${Date.now()}`, occurredAt: new Date().toISOString() };
}

export function outcomeFor(status: 'accepted' | 'rejected' | 'started' | 'succeeded' | 'failed' | 'rolled_back'): AuditOutcome {
  return status;
}

export function redactMetadata(metadata: Record<string, unknown>): Record<string, string | number | boolean | null> {
  return Object.fromEntries(Object.entries(metadata).map(([key, value]) => {
    const sensitive = /token|secret|password|key|cookie|authorization/i.test(key);
    return [key, sensitive ? '[REDACTED]' : typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null ? value : '[REDACTED]'];
  }));
}
