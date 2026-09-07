import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('autonomy surface has required modules', () => {
  for (const file of ['flight-deck.html','operations.html','revenue.html','automations.html','evidence.html','recovery.html','estate.html']) assert.equal(existsSync(file), true, file);
});

test('revenue policy stays model optional', () => {
  const p = JSON.parse(readFileSync('revenue-action-policy.json','utf8'));
  assert.equal(p.model_dependency, 'optional');
  assert.equal(p.default_mode, 'deterministic');
});