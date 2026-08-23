import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, access } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createApp, escapeHtml, defaultProject, normalizeProject } from '../server.mjs';

function request(server, method, route, body, raw = false) {
  const address = server.address();
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: address.port, path: route, method, headers: body || raw ? { 'content-type': 'application/json' } : {} }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        if (data) {
          try { parsed = JSON.parse(data); } catch { parsed = data; }
        }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed, raw: data });
      });
    });
    req.on('error', reject);
    if (raw) req.write(raw);
    else if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function withServer(fn) {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'brushworks-test-'));
  const app = createApp({ dataDir });
  const server = http.createServer(app.handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    return await fn({ server, app, dataDir });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(dataDir, { recursive: true, force: true });
  }
}

test('local API captures leads and creates, generates, duplicates, and packages a project', async () => {
  await withServer(async ({ server }) => {
    const market = await request(server, 'GET', '/api/markets/bg');
    assert.equal(market.status, 200);
    assert.equal(market.body.locale, 'bg-BG');
    assert.equal(market.body.publicLaunch, false);
    assert.equal(market.body.externalWrites, false);

    const health = await request(server, 'GET', '/api/health');
    assert.equal(health.status, 200);
    assert.equal(health.body.mode, 'local-only');
    assert.equal(health.body.liveDeployment, false);

    const lead = await request(server, 'POST', '/api/leads', { name: 'Test Prospect', email: 'test@example.test', interest: 'Brushworks', brief: 'Need a site package.' });
    assert.equal(lead.status, 201);
    assert.equal(lead.body.status, 'local-follow-up-required');
    assert.equal(lead.body.externalDelivery, false);
    assert.equal(lead.body.lead.email, '[stored locally]');

    const leads = await request(server, 'GET', '/api/leads');
    assert.equal(leads.status, 200);
    assert.equal(leads.body.leads.length, 1);
    assert.equal(leads.body.externalDelivery, false);

    const created = await request(server, 'POST', '/api/projects', { name: 'Sellable Test Site', description: 'A test package.', market: 'bg', locale: 'bg-BG' });
    assert.equal(created.status, 201);
    assert.equal(created.body.market, 'bg');
    assert.equal(created.body.claimStatus, 'needs-review');
    assert.equal(created.body.evidenceStatus, 'none');
    assert.equal(created.body.approvalStatus, 'draft');
    assert.equal(created.body.liveDeployment, false);
    const id = created.body.id;

    const generated = await request(server, 'POST', `/api/projects/${id}/generate`, { prompt: 'luxury reseller portfolio' });
    assert.equal(generated.status, 200);
    assert.equal(generated.body.project.template, 'reseller-ops');
    assert.equal(generated.body.generation.externalCalls, false);
    assert.equal(generated.body.generation.approved, false);
    assert.equal(generated.body.project.claimStatus, 'generated');
    assert.notEqual(generated.body.project.approvalStatus, 'approved');
    assert.equal(generated.body.project.liveDeployment, false);

    const duplicate = await request(server, 'POST', `/api/projects/${id}/duplicate`, {});
    assert.equal(duplicate.status, 201);
    assert.match(duplicate.body.name, /Copy$/);
    assert.equal(duplicate.body.status, 'local-draft');
    assert.equal(duplicate.body.liveDeployment, false);

    const published = await request(server, 'POST', `/api/projects/${id}/publish`, {});
    assert.equal(published.status, 200);
    assert.equal(published.body.status, 'package-ready');
    assert.equal(published.body.liveDeployment, false);
    assert.equal(published.body.approvedLive, false);
    assert.equal(published.body.project.evidenceStatus, 'local-package');
    assert.notEqual(published.body.project.approvalStatus, 'approved');
  });
});

test('package artifacts are complete and generated HTML is escaped', async () => {
  await withServer(async ({ server }) => {
    const payload = {
      name: '<script>alert(1)</script>',
      description: 'Quote "xss" & <img src=x onerror=alert(1)>',
      locale: 'en-GB"><script>alert(2)</script>'
    };
    const created = await request(server, 'POST', '/api/projects', payload);
    assert.equal(created.status, 201);
    const published = await request(server, 'POST', `/api/projects/${created.body.id}/publish`, {});
    assert.equal(published.status, 200);
    const required = ['index.html', 'project.json', 'README.md', 'manifest.json', 'DEPLOY.md', '.env.example', 'evidence.json'];
    assert.deepEqual(published.body.artifacts, required);
    for (const name of required) {
      await access(path.join(published.body.artifactDir, name));
    }
    const html = await readFile(path.join(published.body.artifactDir, 'index.html'), 'utf8');
    assert.equal(html.includes('<script>'), false);
    assert.equal(html.includes('onerror='), false);
    assert.match(html, /&lt;script&gt;/);
    assert.match(html, /&quot;xss&quot;/);
    assert.match(html, /&amp;/);
    assert.match(html, /Live deployment is not claimed/);
    const manifest = JSON.parse(await readFile(path.join(published.body.artifactDir, 'manifest.json'), 'utf8'));
    assert.equal(manifest.liveDeployment, false);
    assert.equal(manifest.liveUrl, null);
    const evidence = JSON.parse(await readFile(path.join(published.body.artifactDir, 'evidence.json'), 'utf8'));
    assert.equal(evidence.liveDeployment, false);
    assert.equal(evidence.dnsVerified, false);
    const env = await readFile(path.join(published.body.artifactDir, '.env.example'), 'utf8');
    assert.match(env, /No secrets/);
    assert.equal(env.includes('sk_'), false);
  });
});

test('claim ledger and review stay local and never auto-approve live', async () => {
  await withServer(async ({ server }) => {
    const created = await request(server, 'POST', '/api/projects', { name: 'Evidence Site' });
    const id = created.body.id;
    const claimed = await request(server, 'POST', `/api/projects/${id}/claim`, { type: 'verified', field: 'dns', value: 'live.example', note: 'should stay needs-review' });
    assert.equal(claimed.status, 201);
    assert.notEqual(claimed.body.claim.type, 'verified');
    assert.equal(claimed.body.liveDeployment, false);
    assert.equal(claimed.body.project.dnsVerified, false);
    const reviewed = await request(server, 'POST', `/api/projects/${id}/review`, { approvalStatus: 'approved', note: 'local review only' });
    assert.equal(reviewed.status, 200);
    assert.equal(reviewed.body.approvedLive, false);
    assert.equal(reviewed.body.project.liveDeployment, false);
    const evidence = await request(server, 'GET', `/api/projects/${id}/evidence`);
    assert.equal(evidence.status, 200);
    assert.equal(evidence.body.liveDeployment, false);
    assert.equal(evidence.body.dnsVerified, false);
    assert.ok(evidence.body.claims.length >= 2);
  });
});

test('rejects malformed JSON, oversized bodies, missing projects, and path traversal', async () => {
  await withServer(async ({ server }) => {
    const malformed = await request(server, 'POST', '/api/projects', null, '{not-json');
    assert.equal(malformed.status, 400);
    assert.equal(malformed.body.error, 'invalid request');

    const oversized = await request(server, 'POST', '/api/projects', null, `{"name":"${'x'.repeat(1024 * 1024 + 32)}"}`);
    assert.equal(oversized.status, 413);

    const missing = await request(server, 'GET', '/api/projects/does-not-exist');
    assert.equal(missing.status, 404);

    const missingPublish = await request(server, 'POST', '/api/projects/does-not-exist/publish', {});
    assert.equal(missingPublish.status, 404);

    const traversal = await request(server, 'GET', '/..%2f..%2fpackage.json');
    assert.equal(traversal.status, 400);
    assert.equal(traversal.body.error, 'unsafe path');

    const encodedTraversal = await request(server, 'GET', '/%2e%2e/%2e%2e/package.json');
    assert.ok([400, 404].includes(encodedTraversal.status));
  });
});

test('unsafe names stay escaped and duplicate projects remain local drafts', async () => {
  await withServer(async ({ server }) => {
    const created = await request(server, 'POST', '/api/projects', { name: '../evil<script>', description: '<b>ok</b>' });
    assert.equal(created.status, 201);
    assert.equal(created.body.slug.includes('..'), false);
    assert.equal(created.body.slug.includes('<'), false);
    const first = await request(server, 'POST', `/api/projects/${created.body.id}/duplicate`, {});
    const second = await request(server, 'POST', `/api/projects/${created.body.id}/duplicate`, {});
    assert.equal(first.status, 201);
    assert.equal(second.status, 201);
    assert.notEqual(first.body.id, second.body.id);
    assert.equal(first.body.liveDeployment, false);
    const listed = await request(server, 'GET', '/api/projects');
    assert.ok(listed.body.projects.length >= 3);
  });
});

test('provider adapters are describe-only and margin stays internal', async () => {
  await withServer(async ({ server }) => {
    const adapters = await request(server, 'GET', '/api/providers');
    assert.equal(adapters.status, 200);
    assert.equal(adapters.body.writesExternal, false);
    assert.equal(adapters.body.storesSecrets, false);
    assert.ok(adapters.body.adapters.length >= 5);
    for (const adapter of adapters.body.adapters) {
      assert.equal(adapter.writesExternal, false);
      assert.equal(adapter.storesSecrets, false);
      assert.ok(Array.isArray(adapter.evidenceRequired));
    }

    const blocked = await request(server, 'POST', '/api/providers', { id: 'vercel-hosting' });
    assert.equal(blocked.status, 403);
    assert.equal(blocked.body.writesExternal, false);

    const created = await request(server, 'POST', '/api/projects', {
      name: 'Margin Site',
      provider: 'vercel',
      market: 'bg',
      adapterId: 'vercel-hosting',
      margin: { acquisitionCost: 12, sellPrice: 490, providerCost: 20, renewalCost: 15, currency: 'EUR' }
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.adapterId, 'vercel-hosting');
    assert.equal(created.body.margin.grossMargin, 458);
    assert.equal(created.body.margin.public, false);

    const published = await request(server, 'POST', `/api/projects/${created.body.id}/publish`, {});
    const manifest = JSON.parse(await readFile(path.join(published.body.artifactDir, 'manifest.json'), 'utf8'));
    assert.equal(manifest.margin, 'internal-only');
    assert.equal(manifest.adapterId, 'vercel-hosting');
    const evidence = JSON.parse(await readFile(path.join(published.body.artifactDir, 'evidence.json'), 'utf8'));
    assert.equal(evidence.marginInternal.grossMargin, 458);
    assert.equal(evidence.liveDeployment, false);
  });
});

test('escapeHtml and project defaults stay local-only', () => {
  assert.equal(escapeHtml(`<img src="x" onerror='alert(1)'>`), '&lt;img src&#61;&quot;x&quot; onerror&#61;&#39;alert(1)&#39;&gt;');
  const project = normalizeProject(defaultProject({ name: 'Live Claim', liveUrl: 'https://example.test', liveDeployment: true, approvalStatus: 'approved', dnsVerified: true }));
  assert.equal(project.liveUrl, null);
  assert.equal(project.liveDeployment, false);
  assert.equal(project.dnsVerified, false);
  assert.equal(project.httpsVerified, false);
});


