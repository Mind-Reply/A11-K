// Metric functions for the Sofia Tech Ledger pipeline (index.js).
// NOTE: compute.js is a separate module owned by the parallel scaffold — do not merge.

/** Day-over-day change of the SME digital-intensity index, in percentage points. */
export function digitalIntensityDelta(series) {
  if (!Array.isArray(series) || series.length < 2) return 0;
  const last = series[series.length - 1].value;
  const prev = series[series.length - 2].value;
  return round4(last - prev);
}

/** Simple trailing trend slope (percentage points per day). */
export function digitalIntensityTrend(series, window = 5) {
  if (!Array.isArray(series) || series.length < 2) return 0;
  const slice = series.slice(-window);
  const first = slice[0].value;
  const last = slice[slice.length - 1].value;
  return round4((last - first) / (slice.length - 1));
}

/** Registrations filtered to a single date. */
export function registrationsOn(registrations, date) {
  return (registrations || []).filter((r) => r.registeredAt === date);
}

export function techParkShare(registrations) {
  if (!registrations?.length) return 0;
  const count = registrations.filter((r) => r.techPark).length;
  return round4(count / registrations.length);
}

/** Total EU digitalization money awarded on a date (EUR). */
export function euFundingOn(awards, date) {
  const todays = (awards || []).filter((a) => a.awardedAt === date);
  const totalEur = todays.reduce((s, a) => s + a.amountEur, 0);
  return { count: todays.length, totalEur, awards: todays };
}

/** Sector lag table: largest gap vs EU average first. */
export function digitalizationGaps(sectorLags) {
  return (sectorLags || [])
    .map((s) => ({ ...s, gap: round4(s.euAverage - s.digitalScoreBg) }))
    .sort((a, b) => b.gap - a.gap);
}

/** NIS2 open-findings summary by severity. */
export function nis2Summary(findings) {
  const by = { high: 0, medium: 0, low: 0 };
  for (const f of findings || []) by[f.severity] = (by[f.severity] ?? 0) + 1;
  return { open: (findings || []).length, by };
}

/** Ecosystem momentum: announced round volume in a trailing window (USD). */
export function fundingVelocity(rounds, asOf, windowDays = 7) {
  const end = new Date(asOf).getTime();
  const start = end - windowDays * 86_400_000;
  const inWindow = (rounds || []).filter((r) => {
    const t = new Date(r.announcedAt).getTime();
    return t >= start && t <= end;
  });
  const totalUsd = inWindow.reduce((s, r) => s + r.amountUsd, 0);
  return { count: inWindow.length, totalUsd, rounds: inWindow };
}

/**
 * Composite Digitalization Readiness Index for Sofia SMEs, 0–100.
 * Weights: intensity level (40), trend (20), funding velocity (20), tech-park share (20).
 */
export function readinessIndex({ latestIntensity, trend, fundingTotalUsd, parkShare }) {
  const intensityScore = clamp01(latestIntensity / 5) * 40;
  const trendScore = clamp01(trend / 0.02) * 20;
  const fundingScore = clamp01(fundingTotalUsd / 100_000_000) * 20;
  const parkScore = clamp01(parkShare) * 20;
  return round2(intensityScore + trendScore + fundingScore + parkScore);
}

/** Build the bilingual daily bulletin text. */
export function buildBulletin({ asOf, delta, todaysRegistrations, funding, gaps, nis2, velocity, readiness }) {
  const gap0 = gaps[0];
  const bg = [
    `Дигитален Монитор — София (${formatBgDate(asOf)}):`,
    `Днес още ${funding.count} компании спечелиха еврофинансиране на обща стойност €${funding.totalEur.toLocaleString('bg-BG')} за дигитални надграждания.`,
    `Дигиталната интензивност на софийските МСП се покачи с ${delta.toFixed(2)} процентни пункта.`,
    `Нови технологични регистрации днес: ${todaysRegistrations.length}, от които в София Тех Парк: ${todaysRegistrations.filter((r) => r.techPark).length}.`,
    `Най-изоставащ сектор спрямо средното за ЕС: ${gap0.sector} (разлика ${gap0.gap.toFixed(1)} т.).`,
    `NIS2 монитор: ${nis2.open} открити несъответствия (${nis2.by.high} с висок приоритет).`,
    `Индекс на цифрова готовност: ${readiness}/100.`
  ];
  const en = [
    `Sofia Digital Monitor (${asOf}):`,
    `${funding.count} companies won €${funding.totalEur.toLocaleString('en-GB')} in EU digitalization funding today.`,
    `Sofia SME digital intensity rose ${delta.toFixed(2)}pp.`,
    `New tech registrations today: ${todaysRegistrations.length} (${todaysRegistrations.filter((r) => r.techPark).length} in Sofia Tech Park).`,
    `Largest gap vs EU average: ${gap0.sector} (${gap0.gap.toFixed(1)} pts).`,
    `NIS2 watch: ${nis2.open} findings (${nis2.by.high} high-severity).`,
    `Digital Readiness Index: ${readiness}/100.`
  ];
  return { bg, en };
}

function round4(n) { return Math.round(n * 10_000) / 10_000; }
function round2(n) { return Math.round(n * 100) / 100; }
function clamp01(n) { return Math.min(1, Math.max(0, n)); }

function formatBgDate(iso) {
  const months = ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'];
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}
