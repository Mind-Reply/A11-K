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
import { parseJsonStat, parseJsonStatMulti, toIntensitySeries } from '../src/providers/eurostatLive.js';
import { searchEgovDatasets } from '../src/providers/egovLive.js';
import { fetchTedDigitalProcurement } from '../src/providers/tedLive.js';

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

test('eurostat json-stat parser orders years and values', () => {
  const fake = {
    dimension: { time: { category: { index: { '2021': 0, '2023': 2, '2022': 1 } } } },
    value: { 0: 15.2, 1: 16.8, 2: 18.1 }
  };
  const s = parseJsonStat(fake);
  assert.deepEqual(s.map((p) => p.date), ['2021-01-01', '2022-01-01', '2023-01-01']);
  assert.deepEqual(s.map((p) => p.value), [15.2, 16.8, 18.1]);
  assert.equal(toIntensitySeries(s).length, 3);
});

test('eurostat multi-dim parser decodes BG and EU27 with stride math', () => {
  const fake = {
    id: ['freq', 'unit', 'indic_is', 'size_emp', 'geo', 'time'],
    size: [1, 1, 1, 1, 2, 2],
    dimension: {
      geo: { category: { index: { EU27_2020: 0, BG: 1 } } },
      time: { category: { index: { 2022: 0, 2024: 1 } } }
    },
    value: { 0: 3.42, 1: 6.15, 2: 1.39, 3: 2.45 }
  };
  const r = parseJsonStatMulti(fake);
  assert.deepEqual(r.BG, [{ date: '2022-01-01', value: 1.39 }, { date: '2024-01-01', value: 2.45 }]);
  assert.deepEqual(r.EU27, [{ date: '2022-01-01', value: 3.42 }, { date: '2024-01-01', value: 6.15 }]);
});

test('live eurostat merge path swaps intensity series when fetch succeeds', async () => {
  rmSync(TMP, { recursive: true, force: true });
  process.env.STL_OUT_DIR = TMP;
  process.env.STL_LIVE_EUROSTAT = '1';
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    id: ['geo', 'time'],
    size: [1, 2],
    dimension: {
      geo: { category: { index: { BG: 0 } } },
      time: { category: { index: { 2022: 0, 2024: 1 } } }
    },
    value: { 0: 21.5, 1: 23.9 }
  }), { status: 200, headers: { 'content-type': 'application/json' } });
  try {
    const { report } = await run({ asOf: AS_OF });
    assert.equal(report.liveEurostat.ok, true);
    assert.equal(report.liveEurostat.points, 2);
    assert.equal(report.intensitySeries.at(-1).value, 23.9);
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.STL_LIVE_EUROSTAT;
    delete process.env.STL_OUT_DIR;
    rmSync(TMP, { recursive: true, force: true });
  }
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
test('egov dataset search normalizes payload', async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    success: true,
    total_records: 2,
    datasets: [
      { id: 1, uri: 'u1', name: 'Търговски регистър', org_id: 41, resources: [{}, {}] },
      { id: 2, uri: 'u2', name: 'Регистър на дружествата', org_id: 42, resources: [] }
    ]
  }), { status: 200 });
  try {
    const r = await searchEgovDatasets('търговски регистър');
    assert.equal(r.ok, true);
    assert.equal(r.total, 2);
    assert.equal(r.datasets[0].name, 'Търговски регистър');
    assert.equal(r.datasets[0].resources, 2);
  } finally { globalThis.fetch = realFetch; }
});

test('egov dataset search handles http failure', async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('x', { status: 503 });
  try {
    const r = await searchEgovDatasets('x');
    assert.equal(r.ok, false);
    assert.equal(r.reason, 'http-503');
  } finally { globalThis.fetch = realFetch; }
});

test('ted procurement search normalizes notices', async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    totalNoticeCount: 12516,
    notices: [
      { 'publication-number': '1-2026', 'notice-title': { eng: 'ERP delivery' }, 'buyer-name': { bul: 'Община София' }, 'publication-date': '2026-08-20+03:00', 'winner-name': { eng: 'DataLink EOOD' }, 'total-value': 50000 }
    ]
  }), { status: 200 });
  try {
    const r = await fetchTedDigitalProcurement();
    assert.equal(r.ok, true);
    assert.equal(r.total, 12516);
    assert.equal(r.notices[0].id, '1-2026');
    assert.equal(r.notices[0].buyer, 'Община София');
    assert.equal(r.notices[0].totalValue, 50000);
  } finally { globalThis.fetch = realFetch; }
});
