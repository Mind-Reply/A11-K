import test from 'node:test';
import assert from 'node:assert/strict';
import { rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  digitalIntensityDelta, digitalIntensityTrend, registrationsOn, techParkShare,
  euFundingOn, digitalizationGaps, nis2Summary, fundingVelocity, readinessIndex, buildBulletin
} from '../src/metrics.js';
import { appendEntry, verifyLedger, readEntries } from '../src/ledger.js';
import { run } from '../src/index.js';

const AS_OF = '2026-08-21';
const TMP = 'out-test';

test('digital intensity delta and trend', () => {
  const s = [{ date: 'a', value: 2.0 }, { date: 'b', value: 2.15 }, { date: 'c', value: 2.25 }];
  assert.equal(digitalIntensityDelta(s), 0.1);
  assert.equal(digitalIntensityTrend([{ date: 'a', value: 2.0 }, { date: 'b', value: 2.1 }]), 0.1);
});

test('registrations filter + tech park share', () => {
  const regs = [
    { registeredAt: AS_OF, techPark: true },
    { registeredAt: AS_OF, techPark: false },
    { registeredAt: '2026-08-20', techPark: true }
  ];
  assert.equal(registrationsOn(regs, AS_OF).length, 2);
  assert.equal(techParkShare(registrationsOn(regs, AS_OF)), 0.5);
});

test('EU funding aggregation', () => {
  const awards = [
    { awardedAt: AS_OF, amountEur: 1000 },
    { awardedAt: AS_OF, amountEur: 2500 },
    { awardedAt: '2026-08-20', amountEur: 9999 }
  ];
  const r = euFundingOn(awards, AS_OF);
  assert.equal(r.count, 2);
  assert.equal(r.totalEur, 3500);
});

test('digitalization gaps sorted desc', () => {
  const gaps = digitalizationGaps([
    { sector: 'A', digitalScoreBg: 50, euAverage: 55 },
    { sector: 'B', digitalScoreBg: 20, euAverage: 60 }
  ]);
  assert.equal(gaps[0].sector, 'B');
  assert.equal(gaps[0].gap, 40);
});

test('nis2 summary', () => {
  const s = nis2Summary([{ severity: 'high' }, { severity: 'high' }, { severity: 'low' }]);
  assert.equal(s.open, 3);
  assert.equal(s.by.high, 2);
});

test('funding velocity within window only', () => {
  const rounds = [
    { announcedAt: '2026-08-19', amountUsd: 100 },
    { announcedAt: '2026-08-01', amountUsd: 500 }
  ];
  const v = fundingVelocity(rounds, AS_OF, 7);
  assert.equal(v.count, 1);
  assert.equal(v.totalUsd, 100);
});

test('readiness index bounded 0-100', () => {
  const lo = readinessIndex({ latestIntensity: 0, trend: 0, fundingTotalUsd: 0, parkShare: 0 });
  const hi = readinessIndex({ latestIntensity: 5, trend: 0.02, fundingTotalUsd: 100_000_000, parkShare: 1 });
  assert.equal(lo, 0);
  assert.equal(hi, 100);
});

test('bulletin is bilingual and embeds key numbers', () => {
  const b = buildBulletin({
    asOf: AS_OF, delta: 0.15, todaysRegistrations: [{ techPark: true }],
    funding: { count: 3, totalEur: 121500, awards: [] },
    gaps: [{ sector: 'Строителство', gap: 19.2 }],
    nis2: { open: 2, by: { high: 1 } }, velocity: {}, readiness: 42.5
  });
  assert.ok(b.bg[0].includes('София'));
  assert.ok(b.bg[2].includes('0.15'));
  assert.ok(b.en[0].includes(AS_OF));
  assert.ok(b.en[6].includes('42.5'));
});

test('ledger append is idempotent per date and verifies', () => {
  rmSync(TMP, { recursive: true, force: true });
  const a = appendEntry(TMP, AS_OF, { readiness: 50 });
  const b = appendEntry(TMP, AS_OF, { readiness: 50 });
  assert.equal(a.appended, true);
  assert.equal(b.appended, false);
  assert.equal(verifyLedger(TMP).ok, true);
});

test('ledger detects tampering', () => {
  const file = join(TMP, 'ledger', 'ledger.jsonl');
  const lines = readFileSync(file, 'utf8').split('\n').filter(Boolean);
  const e = JSON.parse(lines[0]);
  e.payloadHash = 'deadbeef'.repeat(8);
  writeFileSync(file, JSON.stringify(e) + '\n', 'utf8');
  const v = verifyLedger(TMP);
  assert.equal(v.ok, false);
  rmSync(TMP, { recursive: true, force: true });
});

test('full pipeline run produces files + verified ledger', async () => {
  rmSync(TMP, { recursive: true, force: true });
  process.env.STL_OUT_DIR = TMP;
  const { report, files, ledger } = await run({ asOf: AS_OF });
  assert.ok(report.readiness > 0 && report.readiness <= 100);
  assert.equal(ledger.verified, true);
  for (const f of Object.values(files)) assert.ok(readFileSync(f, 'utf8').length > 100);
  assert.equal(readEntries(TMP).length, 1);
  delete process.env.STL_OUT_DIR;
  rmSync(TMP, { recursive: true, force: true });
});
