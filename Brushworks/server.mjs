import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { providerMatrix } from './providers/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PORT = Number(process.env.PORT || 4177);
const DEFAULT_HOST = process.env.HOST || '127.0.0.1';
const MAX_BODY = 1024 * 1024;
const PACKAGE_VERSION_PREFIX = '1';
const BG_MARKET = { id: 'bg', locale: 'bg-BG', currency: 'EUR', secondaryCurrency: 'BGN', posture: 'stealth-first', status: 'local-test-only' };

const CLAIM_TYPES = new Set(['user-supplied', 'verified', 'assumed', 'generated', 'needs-review']);
const EVIDENCE_STATES = new Set(['none', 'local-package', 'needs-review', 'verified']);
const APPROVAL_STATES = new Set(['draft', 'needs-review', 'approved', 'rejected']);
const LOCAL_STATUSES = new Set(['local-draft', 'needs-review', 'package-ready']);

const headers = {
  'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; frame-src 'self' https://www.photopea.com; img-src 'self' data: blob:; connect-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

const json = (value) => JSON.stringify(value, null, 2);
const now = () => new Date().toISOString();
const cleanText = (value, fallback = '') => String(value ?? fallback).trim().slice(0, 5000);
const slugify = (value) => cleanText(value, 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64) || 'project';

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"'`=/]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
    '=': '&#61;',
    '/': '&#47;'
  }[char]));
}

export function safeLocale(value) {
  const text = cleanText(value, 'en-GB');
  return /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(text) ? text : 'en-GB';
}

function pickEnum(value, allowed, fallback) {
  const text = cleanText(value, fallback);
  return allowed.has(text) ? text : fallback;
}

const portfolio = [
  { id: 'a11-k', name: 'A11-K.space', category: 'Private SuperIntelligence operating layer', outcome: 'A sovereign control surface for high-value work, research, and execution.', url: 'https://a11-k.space' },
  { id: 'mindreply', name: 'MindReply', category: 'Reply, offer, and next-action system', outcome: 'Turns missed replies and unclear offers into calm, persuasive next actions.', url: 'https://mind-reply.com' },
  { id: 'aurel', name: 'Aurel', category: 'Premium infrastructure and operations', outcome: 'High-trust digital operations presented with a premium, focused experience.', url: 'https://aurel.io' },
  { id: 'brushworks', name: 'Brushworks', category: 'Design-to-site studio', outcome: 'Move from prompt and direction to a structured, exportable site package.', url: 'https://a11-k.space/brushworks' },
  { id: 'letreseller', name: 'LetReseller', category: 'Provider-neutral reseller operations', outcome: 'Domains, hosting, billing, projects, support, and fulfilment in one operating layer.', url: 'https://latreseller.lat' }
];

function evidenceDefaults() {
  return {
    claimStatus: 'needs-review',
    evidenceStatus: 'none',
    approvalStatus: 'draft',
    provider: null,
    adapterId: null,
    margin: null,
    deploymentUrl: null,
    dnsVerified: false,
    httpsVerified: false,
    renewalDate: null,
    packageVersion: 0,
    liveUrl: null,
    liveDeployment: false,
    claims: []
  };
}

export function defaultProject(input = {}) {
  const source = input && typeof input === 'object' ? input : {};
  const title = cleanText(source.name || source.title, 'Untitled project');
  const adapterId = source.adapterId ? cleanText(source.adapterId) : null;
  return {
    id: randomUUID(),
    workspaceId: cleanText(source.workspaceId, 'a11-k-owner'),
    market: cleanText(source.market, 'bg'),
    name: title,
    slug: slugify(title),
    description: cleanText(source.description, 'A premium, conversion-focused digital experience.'),
    template: cleanText(source.template, 'premium-saas'),
    locale: safeLocale(source.locale),
    prompt: cleanText(source.prompt),
    pages: Array.isArray(source.pages) && source.pages.length ? source.pages : [{ id: 'home', name: 'Home', blocks: ['hero', 'proof', 'offer', 'contact'] }],
    blocks: Array.isArray(source.blocks) && source.blocks.length ? source.blocks : ['hero', 'proof', 'offer', 'contact'],
    metadata: { brands: portfolio.map((item) => item.id), ...(source.metadata && typeof source.metadata === 'object' ? source.metadata : {}) },
    status: 'local-draft',
    ...evidenceDefaults(),
    provider: source.provider ? cleanText(source.provider) : null,
    adapterId,
    margin: normalizeMargin(source.margin),
    createdAt: now(),
    updatedAt: now()
  };
}

export function normalizeProject(project = {}) {
  const source = project && typeof project === 'object' ? project : {};
  const next = defaultProject(source);
  next.id = cleanText(source.id, next.id);
  next.market = cleanText(source.market, 'bg');
  next.createdAt = cleanText(source.createdAt, next.createdAt);
  next.updatedAt = cleanText(source.updatedAt, next.updatedAt);
  next.status = pickEnum(source.status, LOCAL_STATUSES, 'local-draft');
  next.claimStatus = pickEnum(source.claimStatus, CLAIM_TYPES, 'needs-review');
  next.evidenceStatus = pickEnum(source.evidenceStatus, EVIDENCE_STATES, 'none');
  next.approvalStatus = pickEnum(source.approvalStatus, APPROVAL_STATES, 'draft');
  next.provider = source.provider ? cleanText(source.provider) : null;
  next.adapterId = source.adapterId ? cleanText(source.adapterId) : null;
  next.margin = normalizeMargin(source.margin);
  next.deploymentUrl = null;
  next.dnsVerified = false;
  next.httpsVerified = false;
  next.renewalDate = source.renewalDate ? cleanText(source.renewalDate) : null;
  next.packageVersion = Number.isInteger(source.packageVersion) && source.packageVersion >= 0 ? source.packageVersion : 0;
  next.liveUrl = null;
  next.liveDeployment = false;
  next.claims = Array.isArray(source.claims) ? source.claims.map(normalizeClaim).filter(Boolean) : [];
  next.packageArtifacts = Array.isArray(source.packageArtifacts) ? source.packageArtifacts.map((item) => cleanText(item)).filter(Boolean) : [];
  return next;
}

function normalizeClaim(claim) {
  if (!claim || typeof claim !== 'object') return null;
  return {
    id: cleanText(claim.id, randomUUID()),
    type: pickEnum(claim.type, CLAIM_TYPES, 'needs-review'),
    field: cleanText(claim.field, 'note'),
    value: cleanText(claim.value),
    note: cleanText(claim.note),
    verified: false,
    createdAt: cleanText(claim.createdAt, now())
  };
}

function normalizeMargin(margin) {
  if (!margin || typeof margin !== 'object') return null;
  const money = (value) => {
    const num = Number(value);
    return Number.isFinite(num) && num >= 0 ? Math.round(num * 100) / 100 : 0;
  };
  const acquisitionCost = money(margin.acquisitionCost);
  const sellPrice = money(margin.sellPrice);
  const providerCost = money(margin.providerCost);
  const renewalCost = money(margin.renewalCost);
  return {
    acquisitionCost,
    sellPrice,
    providerCost,
    renewalCost,
    grossMargin: Math.round((sellPrice - acquisitionCost - providerCost) * 100) / 100,
    currency: /^[A-Z]{3}$/.test(cleanText(margin.currency, 'EUR')) ? cleanText(margin.currency, 'EUR') : 'EUR',
    public: false
  };
}

function defaultState() {
  const project = defaultProject({ name: 'A11 Portfolio Studio', description: 'A premium portfolio and product surface for A11-K, MindReply, Aurel, Brushworks, and LetReseller.' });
  return { version: 2, workspaces: [{ id: 'a11-k-owner', name: 'A11-K Owner Workspace', locale: 'en-GB' }], projects: [project] };
}

function normalizeState(state) {
  const source = state && typeof state === 'object' ? state : defaultState();
  const fallback = defaultState();
  return {
    version: 2,
    workspaces: Array.isArray(source.workspaces) && source.workspaces.length ? source.workspaces : fallback.workspaces,
    projects: Array.isArray(source.projects) ? source.projects.map(normalizeProject) : fallback.projects
  };
}

async function ensureStore(dataDir) {
  await fs.mkdir(dataDir, { recursive: true });
  const file = path.join(dataDir, 'state.json');
  try { await fs.access(file); } catch { await fs.writeFile(file, json(defaultState()), 'utf8'); }
  return file;
}

async function readState(dataDir) {
  const file = await ensureStore(dataDir);
  try { return normalizeState(JSON.parse(await fs.readFile(file, 'utf8'))); } catch { const state = defaultState(); await fs.writeFile(file, json(state), 'utf8'); return state; }
}

async function writeState(dataDir, state) {
  const file = await ensureStore(dataDir);
  const temp = `${file}.tmp`;
  await fs.writeFile(temp, json(normalizeState(state)), 'utf8');
  await fs.rename(temp, file);
}

function generatedLayout(prompt, input = {}) {
  const text = cleanText(prompt, 'premium product website');
  const lower = text.toLowerCase();
  let template = 'premium-saas';
  let blocks = ['hero', 'proof', 'offer', 'contact'];
  if (/shop|store|beauty|product/.test(lower)) { template = 'commerce'; blocks = ['hero', 'products', 'proof', 'faq', 'contact']; }
  if (/portfolio|personal|about|agency/.test(lower)) { template = 'portfolio'; blocks = ['hero', 'work', 'proof', 'about', 'contact']; }
  if (/luxury|premium|aurel/.test(lower)) { template = 'aurel-luxury'; blocks = ['hero', 'proof', 'offer', 'gallery', 'contact']; }
  if (/reseller|domain|hosting|godaddy/.test(lower)) { template = 'reseller-ops'; blocks = ['hero', 'catalogue', 'comparison', 'workflow', 'contact']; }
  return {
    name: cleanText(input.name, text.split(/\s+/).slice(0, 5).join(' ') || 'Generated project'),
    description: `Generated locally from: ${text}`,
    template,
    prompt: text,
    blocks,
    pages: [{ id: 'home', name: 'Home', blocks }, { id: 'proof', name: 'Proof', blocks: ['proof', 'comparison', 'contact'] }, { id: 'contact', name: 'Contact', blocks: ['offer', 'faq', 'contact'] }]
  };
}

function addClaim(project, input = {}) {
  const claim = normalizeClaim({
    id: randomUUID(),
    type: input.type,
    field: input.field,
    value: input.value,
    note: input.note,
    verified: false,
    createdAt: now()
  });
  project.claims = [claim, ...(Array.isArray(project.claims) ? project.claims : [])];
  project.claimStatus = claim.type === 'verified' ? 'needs-review' : claim.type;
  if (project.claimStatus === 'verified') project.claimStatus = 'needs-review';
  project.updatedAt = now();
  return claim;
}

function sanitizeProjectUpdate(project, input = {}) {
  const source = input && typeof input === 'object' ? input : {};
  if (source.name || source.title) {
    project.name = cleanText(source.name || source.title, project.name);
    project.slug = slugify(project.name);
  }
  if (source.market !== undefined) project.market = cleanText(source.market, project.market);
  if (source.description !== undefined) project.description = cleanText(source.description, project.description);
  if (source.template !== undefined) project.template = cleanText(source.template, project.template);
  if (source.locale !== undefined) project.locale = safeLocale(source.locale);
  if (source.prompt !== undefined) project.prompt = cleanText(source.prompt);
  if (Array.isArray(source.pages) && source.pages.length) project.pages = source.pages;
  if (Array.isArray(source.blocks) && source.blocks.length) project.blocks = source.blocks;
  if (source.metadata && typeof source.metadata === 'object') project.metadata = { ...project.metadata, ...source.metadata };
  if (source.provider !== undefined) project.provider = source.provider ? cleanText(source.provider) : null;
  if (source.adapterId !== undefined) project.adapterId = source.adapterId ? cleanText(source.adapterId) : null;
  if (source.margin !== undefined) project.margin = normalizeMargin(source.margin);
  if (source.renewalDate !== undefined) project.renewalDate = source.renewalDate ? cleanText(source.renewalDate) : null;
  project.liveUrl = null;
  project.liveDeployment = false;
  project.dnsVerified = false;
  project.httpsVerified = false;
  project.updatedAt = now();
  return project;
}

function packageFiles(project) {
  const title = escapeHtml(project.name);
  const description = escapeHtml(project.description);
  const locale = escapeHtml(safeLocale(project.locale));
  const template = escapeHtml(project.template);
  const status = escapeHtml(project.status);
  const claimStatus = escapeHtml(project.claimStatus);
  const evidenceStatus = escapeHtml(project.evidenceStatus);
  const approvalStatus = escapeHtml(project.approvalStatus);
  const provider = escapeHtml(project.provider || 'unassigned');
  const indexHtml = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"></head><body><main><h1>${title}</h1><p>${description}</p><p>Template: ${template}. Status: ${status}. Claim: ${claimStatus}. Evidence: ${evidenceStatus}. Approval: ${approvalStatus}. Provider: ${provider}.</p><p>Package-ready local artifact. Live deployment is not claimed.</p></main></body></html>`;
  const manifest = {
    name: project.name,
    slug: project.slug,
    locale: project.locale,
    template: project.template,
    packageVersion: project.packageVersion,
    generatedAt: now(),
    liveDeployment: false,
    liveUrl: null,
    dnsVerified: false,
    httpsVerified: false,
    approvalStatus: project.approvalStatus,
    claimStatus: project.claimStatus,
    evidenceStatus: project.evidenceStatus,
    provider: project.provider,
    adapterId: project.adapterId,
    renewalDate: project.renewalDate,
    artifacts: ['index.html', 'project.json', 'README.md', 'manifest.json', 'DEPLOY.md', '.env.example', 'evidence.json'],
    boundary: 'local-package-only',
    margin: 'internal-only'
  };
  const readme = `# ${project.name}

Status: package-ready local artifact.
Live URL: not deployed.
Claim status: ${project.claimStatus}.
Evidence status: ${project.evidenceStatus}.
Approval status: ${project.approvalStatus}.
Provider: ${project.provider || 'unassigned'}.
Package version: ${project.packageVersion}.

This export is portable. It does not prove DNS, HTTPS, billing, or public availability.
`;
  const deploy = `# Deployment instructions

1. Choose a provider. Brushworks does not lock this package to one host.
2. Copy these files to the provider project.
3. Fill \`.env.example\` locally. Do not commit secrets.
4. Add the provider-issued DNS record only after the host shows it.
5. Record HTTPS, DNS, and URL evidence before claiming live.

Live deployment remains false until independently verified.
`;
  const envExample = `# No secrets. Fill only after a provider is chosen.
HOST=127.0.0.1
PORT=4177
PUBLIC_URL=
`;
  const evidence = {
    projectId: project.id,
    generatedAt: now(),
    liveDeployment: false,
    liveUrl: null,
    dnsVerified: false,
    httpsVerified: false,
    claimStatus: project.claimStatus,
    evidenceStatus: project.evidenceStatus,
    approvalStatus: project.approvalStatus,
    provider: project.provider,
    adapterId: project.adapterId,
    renewalDate: project.renewalDate,
    packageVersion: project.packageVersion,
    marginInternal: project.margin,
    claims: project.claims,
    note: 'Generated packages are never labelled live or approved automatically.'
  };
  return {
    'index.html': indexHtml,
    'project.json': json(project),
    'README.md': readme,
    'manifest.json': json(manifest),
    'DEPLOY.md': deploy,
    '.env.example': envExample,
    'evidence.json': json(evidence)
  };
}

function safeStaticPath(staticDir, requestPath) {
  let decoded;
  try { decoded = decodeURIComponent(requestPath.split('?')[0]); } catch { return null; }
  if (decoded.split('/').includes('..')) return null;
  const requested = decoded === '/' ? '/index.html' : decoded;
  const full = path.resolve(staticDir, `.${requested}`);
  if (full !== staticDir && !full.startsWith(`${staticDir}${path.sep}`)) return null;
  return full;
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8' })[ext] || 'application/octet-stream';
}

async function readBody(req) {
  let total = 0;
  const chunks = [];
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY) throw new Error('request body too large');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { ...headers, 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(type.startsWith('application/json') ? json(body) : body);
}

function publicProject(project) {
  return normalizeProject(project);
}

export function createApp(options = {}) {
  const dataDir = path.resolve(options.dataDir || path.join(here, '.brushworks'));
  const staticDir = path.resolve(options.staticDir || here);
  const exportDir = path.resolve(options.exportDir || path.join(dataDir, 'exports'));

  const handler = async (req, res) => {
    try {
      if (/(?:\\.\\.|%2e%2e)/i.test(req.url || '')) return send(res, 400, { error: 'unsafe path' });
      const url = new URL(req.url, 'http://localhost');
      const method = req.method || 'GET';
      if ((url.pathname === '/reseller' || url.pathname === '/reseller/') && method === 'GET') {
        url.pathname = '/reseller.html';
      }
      if (url.pathname === '/api/health' && method === 'GET') return send(res, 200, { ok: true, service: 'brushworks-local', mode: 'local-only', status: 'ready', liveDeployment: false, host: DEFAULT_HOST, timestamp: now() });
      if (url.pathname === '/api/deployment-target' && method === 'GET') return send(res, 200, { status: 'target-configured', hostname: 'brushworks.a11-k.space', route: '/reseller', canonical: 'https://brushworks.a11-k.space/reseller', dns: 'pending-provider-verification', liveDeployment: false });
      if (url.pathname === '/api/markets/bg' && method === 'GET') return send(res, 200, { ...BG_MARKET, publicLaunch: false, externalWrites: false });
      if (url.pathname === '/api/portfolio' && method === 'GET') return send(res, 200, { status: 'catalogue-ready', items: portfolio, liveDeployment: false });
      if (url.pathname === '/api/providers' && method === 'GET') return send(res, 200, { status: 'adapters-describe-only', ...providerMatrix(), liveDeployment: false });
      if (url.pathname === '/api/providers' && method === 'POST') return send(res, 403, { error: 'provider actions are approval-gated', writesExternal: false, liveDeployment: false });
      if (url.pathname === '/api/leads' && method === 'GET') {
        const leadsFile = path.join(dataDir, 'leads.json');
        let leads = [];
        try { leads = JSON.parse(await fs.readFile(leadsFile, 'utf8')); } catch { /* no enquiries yet */ }
        return send(res, 200, { status: 'local-only', leads, externalDelivery: false });
      }
      if (url.pathname === '/api/leads' && method === 'POST') {
        const input = await readBody(req);
        const lead = {
          id: randomUUID(),
          name: cleanText(input.name, 'Anonymous prospect'),
          email: cleanText(input.email),
          interest: cleanText(input.interest, 'focused build'),
          brief: cleanText(input.brief, 'No brief supplied.'),
          source: 'a11-k-portfolio-local',
          status: 'local-follow-up-required',
          createdAt: now()
        };
        if (!lead.email || !lead.email.includes('@')) return send(res, 422, { error: 'valid email required' });
        const leadsFile = path.join(dataDir, 'leads.json');
        let leads = [];
        try { leads = JSON.parse(await fs.readFile(leadsFile, 'utf8')); } catch { /* first local lead */ }
        leads.unshift(lead);
        await fs.writeFile(leadsFile, json(leads), 'utf8');
        return send(res, 201, { lead: { ...lead, email: '[stored locally]' }, status: lead.status, externalDelivery: false });
      }

      if (url.pathname.startsWith('/api/')) {
        const state = await readState(dataDir);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts[1] === 'projects' && parts.length === 2 && method === 'GET') return send(res, 200, { projects: state.projects.map(publicProject), status: 'local-drafts', liveDeployment: false });
        if (parts[1] === 'projects' && parts.length === 2 && method === 'POST') {
          const input = await readBody(req);
          const project = normalizeProject(defaultProject(input));
          state.projects.unshift(project);
          await writeState(dataDir, state);
          return send(res, 201, publicProject(project));
        }
        if (parts[1] === 'projects' && parts[2]) {
          const id = parts[2];
          const project = state.projects.find((item) => item.id === id);
          if (!project) return send(res, 404, { error: 'project not found' });
          if (parts.length === 3 && method === 'GET') return send(res, 200, publicProject(project));
          if (parts.length === 3 && method === 'PUT') {
            const input = await readBody(req);
            sanitizeProjectUpdate(project, input);
            await writeState(dataDir, state);
            return send(res, 200, publicProject(project));
          }
          if (parts[3] === 'generate' && method === 'POST') {
            const input = await readBody(req);
            const layout = generatedLayout(input.prompt, input);
            Object.assign(project, layout, {
              updatedAt: now(),
              status: 'local-draft',
              claimStatus: 'generated',
              evidenceStatus: 'needs-review',
              approvalStatus: 'needs-review',
              liveUrl: null,
              liveDeployment: false,
              dnsVerified: false,
              httpsVerified: false
            });
            addClaim(project, { type: 'generated', field: 'layout', value: layout.template, note: 'Deterministic local generation. Not live and not approved.' });
            await writeState(dataDir, state);
            return send(res, 200, { project: publicProject(project), generation: { deterministic: true, provider: 'local-boundary', externalCalls: false, liveDeployment: false, approved: false } });
          }
          if (parts[3] === 'duplicate' && method === 'POST') {
            const copy = normalizeProject(defaultProject({ ...project, id: undefined, name: `${project.name} Copy` }));
            copy.status = 'local-draft';
            copy.claimStatus = 'needs-review';
            copy.evidenceStatus = 'none';
            copy.approvalStatus = 'draft';
            copy.packageVersion = 0;
            copy.packageArtifacts = [];
            copy.claims = [];
            copy.liveUrl = null;
            copy.liveDeployment = false;
            state.projects.unshift(copy);
            await writeState(dataDir, state);
            return send(res, 201, publicProject(copy));
          }
          if (parts[3] === 'claim' && method === 'POST') {
            const input = await readBody(req);
            const type = pickEnum(input.type, CLAIM_TYPES, 'user-supplied');
            const claim = addClaim(project, { ...input, type: type === 'verified' ? 'needs-review' : type });
            project.evidenceStatus = project.evidenceStatus === 'none' ? 'needs-review' : project.evidenceStatus;
            if (project.approvalStatus === 'approved') project.approvalStatus = 'needs-review';
            await writeState(dataDir, state);
            return send(res, 201, { project: publicProject(project), claim, liveDeployment: false });
          }
          if (parts[3] === 'review' && method === 'POST') {
            const input = await readBody(req);
            project.approvalStatus = pickEnum(input.approvalStatus, APPROVAL_STATES, 'needs-review');
            project.status = project.approvalStatus === 'draft' ? 'local-draft' : 'needs-review';
            if (project.approvalStatus === 'approved') project.claimStatus = 'needs-review';
            project.liveUrl = null;
            project.liveDeployment = false;
            project.dnsVerified = false;
            project.httpsVerified = false;
            addClaim(project, { type: 'needs-review', field: 'approval', value: project.approvalStatus, note: cleanText(input.note, 'Local review only. Approval is not live proof.') });
            await writeState(dataDir, state);
            return send(res, 200, { project: publicProject(project), liveDeployment: false, approvedLive: false });
          }
          if (parts[3] === 'evidence' && method === 'GET') {
            return send(res, 200, {
              projectId: project.id,
              claimStatus: project.claimStatus,
              evidenceStatus: project.evidenceStatus,
              approvalStatus: project.approvalStatus,
              provider: project.provider,
              deploymentUrl: null,
              dnsVerified: false,
              httpsVerified: false,
              renewalDate: project.renewalDate,
              packageVersion: project.packageVersion,
              liveDeployment: false,
              claims: project.claims
            });
          }
          if (parts[3] === 'publish' && method === 'POST') {
            await fs.mkdir(exportDir, { recursive: true });
            const slug = `${slugify(project.name)}-${project.id.slice(0, 8)}`;
            const target = path.join(exportDir, slug);
            await fs.mkdir(target, { recursive: true });
            project.packageVersion += 1;
            project.status = 'package-ready';
            project.evidenceStatus = 'local-package';
            project.liveUrl = null;
            project.liveDeployment = false;
            project.dnsVerified = false;
            project.httpsVerified = false;
            if (project.approvalStatus === 'approved') project.approvalStatus = 'needs-review';
            addClaim(project, { type: 'generated', field: 'package', value: `v${PACKAGE_VERSION_PREFIX}.${project.packageVersion}`, note: 'Local package written. Live deployment is not claimed.' });
            const files = packageFiles(project);
            for (const [name, content] of Object.entries(files)) {
              await fs.writeFile(path.join(target, name), content, 'utf8');
            }
            project.packageArtifacts = Object.keys(files);
            project.updatedAt = now();
            await writeState(dataDir, state);
            return send(res, 200, {
              project: publicProject(project),
              artifactDir: target,
              artifacts: project.packageArtifacts,
              status: 'package-ready',
              liveDeployment: false,
              approvedLive: false,
              nextStep: 'Connect and verify a real deployment provider before claiming live.'
            });
          }
        }
        return send(res, 404, { error: 'api route not found' });
      }

      const file = safeStaticPath(staticDir, url.pathname);
      if (!file) return send(res, 400, { error: 'unsafe path' });
      try { const data = await fs.readFile(file); res.writeHead(200, { ...headers, 'Content-Type': contentType(file), 'Cache-Control': 'no-cache' }); res.end(data); } catch { send(res, 404, 'Not found', 'text/plain; charset=utf-8'); }
    } catch (error) {
      const status = error.message === 'request body too large' ? 413 : 400;
      send(res, status, { error: status === 413 ? error.message : 'invalid request' });
    }
  };
  return { handler, dataDir, staticDir, exportDir };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const app = createApp();
  app.handler.server = http.createServer(app.handler);
  app.handler.server.listen(DEFAULT_PORT, DEFAULT_HOST, () => console.log(`Brushworks local server: http://${DEFAULT_HOST}:${DEFAULT_PORT}`));
}






