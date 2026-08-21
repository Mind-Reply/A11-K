import { formatMonthYear } from "../calendar.js";

export function renderCopy(metrics, sources) {
  const month = formatMonthYear(metrics.asOf);
  const tradeAwards = metrics.sofiaAwards.filter((row) => row.sector === "trade");
  const awardLine = tradeAwards.length
    ? `Днес още ${bgCount(tradeAwards.length)} ${tradeAwards.length === 1 ? "компания" : "компании"} в сектор „Търговия“ ${tradeAwards.length === 1 ? "спечели" : "спечелиха"} еврофинансиране за ERP системи.`
    : `Днес няма нови потвърдени грантове в сектор „Търговия“.`;
  const intensityLine =
    metrics.intensityDelta == null
      ? "Няма нова дневна точка за дигитална интензивност."
      : `Дигиталната интензивност на софийските МСП се ${metrics.intensityDelta >= 0 ? "покачи" : "понижи"} с ${Math.abs(metrics.intensityDelta).toFixed(2)}%.`;
  const lag = metrics.lagLeader
    ? `Най-голямото изоставане спрямо ЕС е в ${metrics.lagLeader.bg} (${(metrics.lagLeader.gap ?? 0).toFixed(1)} п.п.).`
    : "";

  const bg = [
    `Дигитален монитор — София (${month}): ${awardLine} ${intensityLine} ${lag}`.replace(/\s+/g, " ").trim(),
    `Нови регистрации в София днес: ${metrics.sofiaRegs.length}, от които ${metrics.techParkRegs} около Sofia Tech Park.`,
    `Публични грантове днес: ${metrics.awardCount} / ${formatEur(metrics.awardTotalEur)}.`,
  ];

  const en = [
    `Sofia Digital Monitor (${metrics.asOf}): ${metrics.awardCount} verified grant event(s), ${formatEur(metrics.awardTotalEur)} total.`,
    `SME digital intensity print: ${metrics.intensity ?? "n/a"} (${signedEn(metrics.intensityDelta)}).`,
    metrics.lagLeader
      ? `Largest EU gap: ${metrics.lagLeader.en} at ${(metrics.lagLeader.gap ?? 0).toFixed(1)} pp.`
      : "No sector gap available.",
  ];

  return {
    titleBg: `Дигитален монитор — София (${month})`,
    titleEn: `Sofia Digital Monitor — ${metrics.asOf}`,
    brand: sources.brand,
    bulletsBg: bg,
    bulletsEn: en,
    linkedinBg: bg.join(" "),
    disclaimer:
      "Непубликувани твърдения за 2% / 87% остават хипотеза до прикачен Eurostat/NSI източник. Няма скрейп на RegiX и няма лични контакти.",
  };
}

function bgCount(n) {
  const map = { 1: "една", 2: "две", 3: "три", 4: "четири", 5: "пет" };
  return map[n] || String(n);
}

function signedEn(value) {
  if (value == null) return "no daily change";
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(2)} pp`;
}

function formatEur(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
