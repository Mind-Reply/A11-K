import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PORT = Number(process.env.PORT || 4177);
const MAX_BODY = 1024 * 1024;

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

const portfolio = [
  { id: 'a11-k', name: 'A11-K.space', category: 'Private SuperIntelligence operating layer', outcome: 'A sovereign control surface for high-value work, research, and execution.', url: 'https://a11-k.space' },
  { id: 'mindreply', name: 'MindReply', category: 'Reply, offer, and next-action system', outcome: 'Turns missed replies and unclear offers into calm, persuasive next actions.', url: 'https://mind-reply.com' },
  { id: 'aurel', name: 'Aurel', category: 'Premium infrastructure and operations', outcome: 'High-trust digital operations presented with a premium, focused experience.', url: 'https://aurel.io' },
  { id: 'brushworks', name: 'Brushworks', category: 'Design-to-site studio', outcome: 'Move from prompt and direction to a structured, exportable site package.', url: 'https://a11-k.space/brushworks' },
  { id: 'letreseller', name: 'LetReseller', category: 'Provider-neutral reseller operations', outcome: 'Domains, hosting, billing, projects, support, and fulfilment in one operating layer.', url: 'https://latreseller.lat' }
];

function defaultProject(input = {}) {
  const title = cleanText(input.name || input.title, 'Untitled project');
  return {
    id: randomUUID(),
    workspaceId: cleanText(input.workspaceId, 'a11-k-owner'),
    name: title,
    slug: slugify(title),
    description: cleanText(input.description, 'A premium, conversion-focused digital experience.'),
    template: cleanText(input.template, 'premium-saas'),
    locale: cleanText(input.locale, 'en-GB'),
    prompt: cleanText(input.prompt),
    pages: Array.isArray(input.pages) && input.pages.length ? input.pages : [{ id: 'home', name: 'Home', blocks: ['hero', 'proof', 'offer', 'contact'] }],
    blocks: Array.isArray(input.blocks) && input.blocks.length ? input.blocks : ['hero', 'proof', 'offer', 'contact'],
    metadata: { brands: portfolio.map((item) => item.id), ...(input.metadata && typeof input.metadata === 'object' ? input.metadata : {}) },
    status: 'local-draft',
    liveUrl: null,
    createdAt: now(),
    updatedAt: now()
  };
}

function defaultState() {
  const project = defaultProject({ name: 'A11 Portfolio Studio', description: 'A premium portfolio and product surface for A11-K, MindReply, Aurel, Brushworks, and LetReseller.' });
  return { version: 1, workspaces: [{ id: 'a11-k-owner', name: 'A11-K Owner Workspace', locale: 'en-GB' }], projects: [project] };
}

async function ensureStore(dataDir) {
  await fs.mkdir(dataDir, { recursive: true });
  const file = path.join(dataDir, 'state.json');
  try { await fs.access(file); } catch { await fs.writeFile(file, json(defaultState()), 'utf8'); }
  return file;
}

async function readState(dataDir) {
  const file = await ensureStore(dataDir);
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { const state = defaultState(); await fs.writeFile(file, json(state), 'utf8'); return state; }
}

async function writeState(dataDir, state) {
  const file = await ensureStore(dataDir);
  const temp = `${file}.tmp`;
  await fs.writeFile(temp, json(state), 'utf8');
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

function safeStaticPath(staticDir, requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0]);
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

export function createApp(options = {}) {
  const dataDir = path.resolve(options.dataDir || path.join(here, '.brushworks'));
  const staticDir = path.resolve(options.staticDir || here);
  const exportDir = path.resolve(options.exportDir || path.join(dataDir, 'exports'));

  const handler = async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const method = req.method || 'GET';
      if ((url.pathname === '/reseller' || url.pathname === '/reseller/') && method === 'GET') {
        url.pathname = '/reseller.html';
      }
      if (url.pathname === '/api/health' && method === 'GET') return send(res, 200, { ok: true, service: 'brushworks-local', mode: 'local-only', status: 'ready', liveDeployment: false, timestamp: now() });
      if (url.pathname === '/api/deployment-target' && method === 'GET') return send(res, 200, { status: 'target-configured', hostname: 'brushworks.a11-k.space', route: '/reseller', canonical: 'https://brushworks.a11-k.space/reseller', dns: 'pending-provider-verification', liveDeployment: false });
      if (url.pathname === '/api/portfolio' && method === 'GET') return send(res, 200, { status: 'catalogue-ready', items: portfolio, liveDeployment: false });
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
        if (parts[1] === 'projects' && parts.length === 2 && method === 'GET') return send(res, 200, { projects: state.projects, status: 'local-drafts' });
        if (parts[1] === 'projects' && parts.length === 2 && method === 'POST') {
          const input = await readBody(req);
          const project = defaultProject(input);
          state.projects.unshift(project);
          await writeState(dataDir, state);
          return send(res, 201, project);
        }
        if (parts[1] === 'projects' && parts[2]) {
          const id = parts[2];
          const project = state.projects.find((item) => item.id === id);
          if (!project) return send(res, 404, { error: 'project not found' });
          if (parts.length === 3 && method === 'GET') return send(res, 200, project);
          if (parts.length === 3 && method === 'PUT') {
            const input = await readBody(req);
            Object.assign(project, input, { id: project.id, updatedAt: now() });
            await writeState(dataDir, state);
            return send(res, 200, project);
          }
          if (parts[3] === 'generate' && method === 'POST') {
            const input = await readBody(req);
            const layout = generatedLayout(input.prompt, input);
            Object.assign(project, layout, { updatedAt: now(), status: 'local-draft' });
            await writeState(dataDir, state);
            return send(res, 200, { project, generation: { deterministic: true, provider: 'local-boundary', externalCalls: false } });
          }
          if (parts[3] === 'duplicate' && method === 'POST') {
            const copy = defaultProject({ ...project, id: undefined, name: `${project.name} Copy`, status: 'local-draft' });
            state.projects.unshift(copy);
            await writeState(dataDir, state);
            return send(res, 201, copy);
          }
          if (parts[3] === 'publish' && method === 'POST') {
            await fs.mkdir(exportDir, { recursive: true });
            const slug = `${slugify(project.name)}-${project.id.slice(0, 8)}`;
            const target = path.join(exportDir, slug);
            await fs.mkdir(target, { recursive: true });
            const artifact = `<!doctype html><html lang="${project.locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${project.name}</title><meta name="description" content="${project.description.replaceAll('"', '&quot;')}"></head><body><main><h1>${project.name}</h1><p>${project.description}</p><p>Package-ready local artifact. Live deployment is not claimed.</p></main></body></html>`;
            await fs.writeFile(path.join(target, 'index.html'), artifact, 'utf8');
            await fs.writeFile(path.join(target, 'project.json'), json(project), 'utf8');
            await fs.writeFile(path.join(target, 'README.md'), `# ${project.name}\n\nStatus: package-ready local artifact.\nLive URL: not deployed.\n`, 'utf8');
            project.status = 'package-ready';
            project.liveUrl = null;
            project.updatedAt = now();
            await writeState(dataDir, state);
            return send(res, 200, { project, artifactDir: target, status: 'package-ready', liveDeployment: false, nextStep: 'Connect and verify a real deployment provider before claiming live.' });
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
  app.handler.server.listen(DEFAULT_PORT, '127.0.0.1', () => console.log(`Brushworks local server: http://127.0.0.1:${DEFAULT_PORT}`));
}
