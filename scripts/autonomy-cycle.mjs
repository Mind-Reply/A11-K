import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const required = [
  'index.html','flight-deck.html','operations.html','revenue.html','automations.html','evidence.html','recovery.html','estate.html',
  'revenue-action-policy.json','docs/REVENUE_AUTONOMY_CANON.md','.github/workflows/revenue-determinism.yml'
];
const checks = Object.fromEntries(required.map((file) => [file, existsSync(file)]));
const policy = JSON.parse(readFileSync('revenue-action-policy.json', 'utf8'));
const forbidden = new Set(policy.model_must_not_be_required_for || []);
const revenueActions = ['price_calculation','order_creation','entitlement_grant','settlement_calculation','ledger_posting','reconciliation','revenue_reporting'];
checks.revenue_independence = policy.model_dependency === 'optional' && policy.default_mode === 'deterministic' && revenueActions.every((x) => forbidden.has(x));
let tests = 'not-run';
try { execFileSync('node', ['--test','tests/'], { stdio: 'pipe' }); tests = 'PASS'; } catch { tests = 'FAIL'; }
const secretPattern = /(sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,}|BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY)/;
let secretBoundary = 'PASS';
for (const file of ['src','scripts']) {
  try { const out = execFileSync('grep', ['-RInE', secretPattern.source, file], { stdio: ['ignore','pipe','ignore'] }).toString(); if (out.trim()) secretBoundary = 'FAIL'; } catch {}
}
checks.secret_boundary = secretBoundary === 'PASS';
const ok = Object.values(checks).every(Boolean) && tests === 'PASS';
const state = {
  schema:'a11-k.autonomy-state.v1', mode:'deterministic', status:ok?'READY':'ATTENTION',
  checks:{...checks, repository_tests:tests, production_claim:'EVIDENCE_REQUIRED'},
  autonomous_domains:['estate','deployments','revenue','evidence','recovery','content','governance'],
  human_gates:['production promotion','billing','payments','credentials','dns','external communications','destructive changes']
};
mkdirSync('ops',{recursive:true});
writeFileSync('ops/autonomy-state.json', JSON.stringify(state,null,2)+'\n');
console.log(JSON.stringify(state,null,2));
if (!ok) process.exitCode = 1;