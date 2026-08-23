import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createApp } from '../server.mjs';

function request(server, method, route, body) {
  const address = server.address();
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: address.port, path: route, method, headers: body ? { 'content-type': 'application/json' } : {} }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

test('local API captures leads and creates, generates, duplicates, and packages a project', async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'brushworks-test-'));
  const app = createApp({ dataDir });
  const server = http.createServer(app.handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
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

    const created = await request(server, 'POST', '/api/projects', { name: 'Sellable Test Site', description: 'A test package.' });
    assert.equal(created.status, 201);
    const id = created.body.id;

    const generated = await request(server, 'POST', `/api/projects/${id}/generate`, { prompt: 'luxury reseller portfolio' });
    assert.equal(generated.status, 200);
    assert.equal(generated.body.project.template, 'reseller-ops');
    assert.equal(generated.body.generation.externalCalls, false);

    const duplicate = await request(server, 'POST', `/api/projects/${id}/duplicate`, '{}');
    assert.equal(duplicate.status, 201);
    assert.match(duplicate.body.name, /Copy$/);

    const published = await request(server, 'POST', `/api/projects/${id}/publish`, '{}');
    assert.equal(published.status, 200);
    assert.equal(published.body.status, 'package-ready');
    assert.equal(published.body.liveDeployment, false);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(dataDir, { recursive: true, force: true });
  }
});
