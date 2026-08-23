// Brushworks synthetic reliability harness.
// Runs the brief-to-package workflow repeatedly with dummy data against a
// throwaway local server, then fires malformed-input and failure cases.
// No network calls, no providers, no secrets, no external writes.

import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createApp } from '../server.mjs';

function request(server, method, route, body, raw = false) {
  const address = server.address();
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: address.port, path: route, method, headers: body || raw ? { 'content-type': 'application/json' } : {} }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        if (data) { try { parsed = JSON.parse(data); } catch { parsed = data; } }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (raw) req.write(raw);
    else if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const results = [];
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${name}${detail ? ` — ${detail}` : ''}`);
};

const dataDir = await mkdtemp(path.join(os.tmpdir(), 'brushworks-reliability-'));
const app = createApp({ dataDir });
const server = http.createServer(app.handler);
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

let failures = 0;
try {
  // 1-3. Repeat brief-to-package with synthetic data
  for (let run = 1; run <= 3; run += 1) {
    const created = await request(server, 'POST', '/api/projects', { name: `Synthetic Run ${run}`, description: 'Dummy reliability brief.' });
    const id = created.body && created.body.id;
    const generated = await request(server, 'POST', `/api/projects/${id}/generate`, { prompt: run % 2 ? 'reseller hosting catalogue' : 'premium agency portfolio' });
    const published = await request(server, 'POST', `/api/projects/${id}/publish`, {});
    const ok = created.status === 201 && generated.status === 200 && published.status === 200
      && published.body.status === 'package-ready' && published.body.liveDeployment === false;
    record(`synthetic brief-to-package run ${run}`, ok, `template=${generated.body && generated.body.project && generated.body.project.template}`);
    if (!ok) failures += 1;
  }

  // 4. Malformed JSON input
  const malformed = await request(server, 'POST', '/api/projects', null, '{broken');
  record('malformed input rejected', malformed.status === 400, `status=${malformed.status}`);
  if (malformed.status !== 400) failures += 1;

  // 5. Missing project target
  const missing = await request(server, 'POST', '/api/projects/not-a-real-id/generate', { prompt: 'x' });
  record('missing project rejected', missing.status === 404, `status=${missing.status}`);
  if (missing.status !== 404) failures += 1;

  // 6. Duplicate submissions produce distinct projects
  const a = await request(server, 'POST', '/api/projects', { name: 'Duplicate Guard' });
  const b = await request(server, 'POST', '/api/projects', { name: 'Duplicate Guard' });
  record('duplicate submissions stay distinct', a.status === 201 && b.status === 201 && a.body.id !== b.body.id);
  if (a.body.id === b.body.id) failures += 1;

  // 7. Failed-generation recovery: publish still forces local-only state
  const target = await request(server, 'POST', '/api/projects', { name: 'Recovery Target' });
  const pub = await request(server, 'POST', `/api/projects/${target.body.id}/publish`, {});
  const stillLocal = pub.status === 200 && pub.body.liveDeployment === false && pub.body.project.dnsVerified === false;
  record('interrupted flow cannot claim live', stillLocal);
  if (!stillLocal) failures += 1;

  // 8. Provider adapters stay describe-only
  const adapters = await request(server, 'GET', '/api/providers');
  const safe = adapters.status === 200 && Array.isArray(adapters.body.adapters)
    && adapters.body.adapters.every((item) => item.writesExternal === false && item.storesSecrets === false);
  record('provider adapters describe-only', safe, `adapters=${adapters.body && adapters.body.adapters ? adapters.body.adapters.length : 0}`);
  if (!safe) failures += 1;
} finally {
  await new Promise((resolve) => server.close(resolve));
  await rm(dataDir, { recursive: true, force: true });
}

console.log(`SUMMARY: ${results.length - failures}/${results.length} checks passed`);
if (failures > 0) {
  console.error(`RELIABILITY: ${failures} check(s) failed`);
  process.exit(1);
}
console.log('RELIABILITY: all checks passed, zero external writes');
