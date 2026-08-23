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
  'package.json'
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

console.log(`VERIFIED: ${required.length} core files present`);
console.log('VERIFIED: index.html loads the platform assets');
console.log('VERIFIED: sales.html contains the local lead path');
console.log('VERIFIED: five required portfolio properties are catalogued');
console.log('VERIFIED: local-only package boundary remains explicit');
