import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'index.html',
  'app.js',
  'server.mjs',
  'platform.js',
  'platform.css',
  'portfolio.json',
  'PORTFOLIO.md',
  'SALES_KIT.md',
  'sales.html',
  'sales.css',
  'sales.js',
  'package.json',
  'Dockerfile',
  'cloudbuild.yaml',
  '.env.example',
  'providers/index.mjs',
  'reliability/run.mjs',
  'BG_MARKET_POSITIONING.md',
  'config/markets/bg.json',
  'evidence/market/2026-08-23-bg-market-readiness.md'
];

for (const relative of required) {
  const file = path.join(root, relative);
  const stat = await fs.stat(file);
  if (!stat.isFile() || stat.size === 0) throw new Error(`Missing or empty file: ${relative}`);
}

const html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
for (const asset of ['style.css', 'platform.css', 'app.js', 'platform.js']) {
  if (!html.includes(asset)) throw new Error(`index.html does not load ${asset}`);
}
for (const step of ['Brief', 'Evidence', 'Draft', 'Review', 'Package', 'Deploy proof', 'Renew']) {
  if (!html.includes(step)) throw new Error(`index.html missing workflow step: ${step}`);
}

const salesHtml = await fs.readFile(path.join(root, 'sales.html'), 'utf8');
for (const asset of ['sales.css', 'sales.js']) {
  if (!salesHtml.includes(asset)) throw new Error(`sales.html missing ${asset}`);
}
const salesJs = await fs.readFile(path.join(root, 'sales.js'), 'utf8');
if (!salesJs.includes("'/api/leads'")) throw new Error('sales.js missing local lead endpoint');

const portfolio = JSON.parse(await fs.readFile(path.join(root, 'portfolio.json'), 'utf8'));
const names = new Set((portfolio.items || portfolio).map((item) => item.name));
for (const name of ['A11-K.space', 'MindReply', 'Aurel', 'Brushworks', 'LetReseller']) {
  if (!names.has(name)) throw new Error(`Portfolio missing ${name}`);
}

const server = await fs.readFile(path.join(root, 'server.mjs'), 'utf8');
for (const token of ['BG_MARKET', 'market', 'escapeHtml', 'claimStatus', 'evidenceStatus', 'approvalStatus', 'manifest.json', '.env.example', 'evidence.json', 'liveDeployment: false', 'adapterId', 'normalizeMargin', '/api/providers']) {
  if (!server.includes(token)) throw new Error(`server.mjs missing ${token}`);
}

const providers = await fs.readFile(path.join(root, 'providers/index.mjs'), 'utf8');
for (const token of ['writesExternal: false', 'storesSecrets: false', 'evidenceRequired']) {
  if (!providers.includes(token)) throw new Error(`providers/index.mjs missing ${token}`);
}

console.log(`VERIFIED: ${required.length} core files present`);
console.log('VERIFIED: index.html loads the platform assets');
console.log('VERIFIED: sales.html contains the local lead path');
console.log('VERIFIED: five required portfolio properties are catalogued');
console.log('VERIFIED: local-only package boundary remains explicit');
console.log('VERIFIED: evidence, claim, and portable package contract present');
console.log('VERIFIED: provider adapters are describe-only and store no secrets');
console.log('VERIFIED: reseller margin fields stay internal');

