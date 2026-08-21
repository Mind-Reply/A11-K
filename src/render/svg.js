export function renderInfographic(metrics, sources) {
  const width = 1200;
  const height = 675;
  const sectors = metrics.sectors.slice(0, 6);
  const maxGap = Math.max(...sectors.map((row) => row.gap || 0), 1);
  const bars = sectors
    .map((row, index) => {
      const y = 250 + index * 58;
      const w = Math.max(8, Math.round(((row.gap || 0) / maxGap) * 520));
      return `
        <rect x="96" y="${y}" width="${w}" height="34" rx="8" fill="${row.color || "#38BDF8"}"/>
        <text x="88" y="${y + 23}" fill="#E2E8F0" font-size="18" text-anchor="end" font-family="Segoe UI, sans-serif">${escapeXml(row.bg)}</text>
        <text x="${110 + w}" y="${y + 23}" fill="#F8FAFC" font-size="18" font-family="Segoe UI, sans-serif">${(row.gap ?? 0).toFixed(1)} п.п.</text>
      `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#08111F"/>
  <text x="64" y="72" fill="#7DD3FC" font-size="22" letter-spacing="2" font-family="Segoe UI, sans-serif">${escapeXml(sources.brand.bg.toUpperCase())}</text>
  <text x="64" y="122" fill="#F8FAFC" font-size="42" font-weight="700" font-family="Segoe UI, sans-serif">Дигитален монитор — София</text>
  <text x="64" y="168" fill="#94A3B8" font-size="22" font-family="Segoe UI, sans-serif">${escapeXml(metrics.asOf)} · ${metrics.awardCount} нови гранта · ${formatEur(metrics.awardTotalEur)}</text>
  <text x="820" y="122" fill="#38BDF8" font-size="56" font-weight="700" font-family="Segoe UI, sans-serif">${formatPct(metrics.intensity)}</text>
  <text x="820" y="162" fill="#94A3B8" font-size="18" font-family="Segoe UI, sans-serif">дигитална интензивност МСП</text>
  <text x="820" y="196" fill="#86EFAC" font-size="20" font-family="Segoe UI, sans-serif">${signed(metrics.intensityDelta)}</text>
  ${bars}
  <text x="64" y="640" fill="#64748B" font-size="16" font-family="Segoe UI, sans-serif">Източници: публични регистри / Eurostat / data.egov.bg. Не е скрейп на RegiX.</text>
</svg>`;
}

function formatPct(value) {
  return value == null ? "n/a" : `${Number(value).toFixed(2)}%`;
}

function signed(value) {
  if (value == null) return "без дневна промяна";
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(2)} п.п.`;
}

function formatEur(value) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
