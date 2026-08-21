export function digitalIntensityDelta(series) {
  if (!series || series.length < 2) return 0;
  return Number((series.at(-1).value - series.at(-2).value).toFixed(4));
}

export function digitalIntensityTrend(series) {
  if (!series || series.length < 2) return 0;
  return Number((series.at(-1).value - series[0].value).toFixed(4));
}

export function registrationsOn(rows, asOf) {
  return (rows || []).filter((row) => row.registeredAt === asOf);
}

export function techParkShare(rows) {
  if (!rows?.length) return 0;
  return rows.filter((row) => row.techPark).length / rows.length;
}

export function euFundingOn(awards, asOf) {
  const todays = (awards || []).filter((row) => row.awardedAt === asOf);
  return {
    count: todays.length,
    totalEur: todays.reduce((sum, row) => sum + (Number(row.amountEur) || 0), 0),
    awards: todays,
  };
}

export function digitalizationGaps(sectorLags) {
  return [...(sectorLags || [])]
    .map((row) => ({
      ...row,
      gap: Number((row.euAverage - row.digitalScoreBg).toFixed(2)),
    }))
    .sort((a, b) => b.gap - a.gap);
}

export function nis2Summary(findings) {
  const by = {};
  for (const row of findings || []) {
    const key = row.severity || "unknown";
    by[key] = (by[key] || 0) + 1;
  }
  return { open: (findings || []).length, by };
}

export function fundingVelocity(rounds, asOf, windowDays = 7) {
  const end = new Date(`${asOf}T12:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - windowDays);
  const inWindow = (rounds || []).filter((row) => {
    const date = new Date(`${row.announcedAt}T12:00:00Z`);
    return date >= start && date <= end;
  });
  return {
    count: inWindow.length,
    totalUsd: inWindow.reduce((sum, row) => sum + (Number(row.amountUsd) || 0), 0),
    rounds: inWindow,
  };
}

export function readinessIndex({ latestIntensity = 0, trend = 0, fundingTotalUsd = 0, parkShare = 0 }) {
  const intensityScore = Math.min(40, (Number(latestIntensity) / 5) * 40);
  const trendScore = Math.min(20, (Number(trend) / 0.02) * 20);
  const fundingScore = Math.min(20, (Number(fundingTotalUsd) / 100_000_000) * 20);
  const parkScore = Math.min(20, Number(parkShare) * 20);
  return Number(Math.max(0, Math.min(100, intensityScore + trendScore + fundingScore + parkScore)).toFixed(1));
}

export function buildBulletin({ asOf, delta, todaysRegistrations, funding, gaps, nis2, velocity, readiness }) {
  const month = asOf?.slice(0, 7) === "2026-08" ? "Август 2026" : asOf;
  const tradeCount = funding?.count ?? 0;
  const deltaAbs = Math.abs(Number(delta) || 0).toFixed(2);
  const direction = (delta || 0) >= 0 ? "покачи" : "понижи";
  const lag = gaps?.[0];
  const bg = [
    `Дигитален Монитор — София (${month}): дневна снимка на МСП дигитализация, грантове и регистрации.`,
    tradeCount
      ? `Днес още ${bgCount(tradeCount)} ${tradeCount === 1 ? "компания" : "компании"} в сектор „Търговия“ ${tradeCount === 1 ? "спечели" : "спечелиха"} еврофинансиране за ERP системи.`
      : "Днес няма нови потвърдени грантове в сектор „Търговия“.",
    `Дигиталната интензивност на софийските МСП се ${direction} с ${deltaAbs}%.`,
    `Нови тех регистрации днес: ${todaysRegistrations?.length ?? 0}.`,
    `ЕС финансиране днес: €${Number(funding?.totalEur || 0).toLocaleString("en-GB")}.`,
    lag ? `Най-голямото изоставане спрямо ЕС е в ${lag.sector} (${lag.gap} п.п.).` : "Няма секторно изоставане.",
    `Отворени NIS2 констатации: ${nis2?.open ?? 0}. Индекс на цифрова готовност: ${readiness}/100.`,
  ];
  const en = [
    `Sofia Digital Monitor (${asOf}): daily SME digitalization, grants and registry snapshot.`,
    `${funding?.count ?? 0} verified grant event(s) totaling €${Number(funding?.totalEur || 0).toLocaleString("en-GB")}.`,
    `SME digital intensity moved ${deltaAbs} pp.`,
    `${todaysRegistrations?.length ?? 0} new Sofia tech registration(s).`,
    lag ? `Largest EU gap: ${lag.sector} at ${lag.gap} pp.` : "No sector gap available.",
    `Open NIS2 findings: ${nis2?.open ?? 0}. 7-day funding velocity: $${Number(velocity?.totalUsd || 0).toLocaleString("en-GB")}.`,
    `Digital readiness index: ${readiness}/100.`,
  ];
  return { bg, en };
}

export function latestOnOrBefore(series, asOf) {
  return [...(series || [])].filter((row) => row.date <= asOf).at(-1) ?? null;
}

export function previousOnOrBefore(series, asOf) {
  const rows = [...(series || [])].filter((row) => row.date <= asOf);
  return rows.length > 1 ? rows.at(-2) : null;
}

export function delta(current, previous) {
  if (current == null || previous == null) return null;
  return Number((current - previous).toFixed(4));
}

export function gapToEu(localScore, euAverage) {
  if (localScore == null || euAverage == null) return null;
  return Number((euAverage - localScore).toFixed(2));
}

export function rankSectors(sectorLags) {
  return digitalizationGaps(sectorLags).map((row, index) => ({ ...row, rank: index + 1 }));
}

export function filterSofia(rows, asOf) {
  return (rows || []).filter((row) => {
    const date = row.registeredAt || row.awardedAt || row.announcedAt || row.detectedAt;
    return (!date || date <= asOf) && (row.city === "София" || row.city == null);
  });
}

export function countBy(rows, key) {
  return (rows || []).reduce((acc, row) => {
    const value = row[key] || "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

export function sum(rows, key) {
  return (rows || []).reduce((total, row) => total + (Number(row[key]) || 0), 0);
}

export function extractSignals(text) {
  const haystack = String(text || "");
  return {
    funding: /финансир|funding|grant|award|евро/i.test(haystack),
    erp: /erp|е-фактур|облак|cloud|crm/i.test(haystack),
    nis2: /nis2|инцидент|кибер/i.test(haystack),
  };
}

export function buildMetrics(dataset, asOf) {
  const intensityNow = latestOnOrBefore(dataset.smeDigitalIntensity, asOf);
  const intensityPrev = previousOnOrBefore(dataset.smeDigitalIntensity, asOf);
  const sofiaAwards = filterSofia(dataset.euFundingAwards, asOf).filter((row) => row.awardedAt === asOf);
  const sofiaRegs = filterSofia(dataset.registrations, asOf).filter((row) => row.registeredAt === asOf);
  const sectors = rankSectors(dataset.sectorLags);
  return {
    asOf,
    intensity: intensityNow?.value ?? null,
    intensityDelta: delta(intensityNow?.value, intensityPrev?.value),
    sofiaAwards,
    sofiaRegs,
    awardCount: sofiaAwards.length,
    awardTotalEur: sum(sofiaAwards, "amountEur"),
    awardsBySector: countBy(sofiaAwards, "sector"),
    techParkRegs: sofiaRegs.filter((row) => row.techPark).length,
    sectors,
    lagLeader: sectors[0] ?? null,
    fundingRounds: (dataset.fundingRounds || []).filter((row) => row.announcedAt <= asOf),
    nis2Findings: (dataset.nis2Findings || []).filter((row) => row.detectedAt <= asOf),
  };
}

function bgCount(n) {
  const map = { 1: "една", 2: "две", 3: "три", 4: "четири", 5: "пет" };
  return map[n] || String(n);
}
