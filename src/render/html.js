export function renderHtml(copy, metrics) {
  const bullets = copy.bulletsBg.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  const awards = metrics.sofiaAwards
    .map(
      (row) =>
        `<tr><td>${escapeHtml(row.company)}</td><td>${escapeHtml(row.program)}</td><td>${escapeHtml(String(row.amountEur))}</td><td>${escapeHtml(row.source)}</td></tr>`,
    )
    .join("");
  return `<!doctype html>
<html lang="bg">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(copy.titleBg)}</title>
  <style>
    body { font-family: Segoe UI, sans-serif; background:#08111F; color:#F8FAFC; margin:0; padding:48px; }
    h1 { margin-bottom:8px; }
    .muted { color:#94A3B8; }
    ul { line-height:1.6; }
    table { border-collapse:collapse; width:100%; margin-top:24px; }
    td, th { border-bottom:1px solid #1E293B; padding:10px 8px; text-align:left; }
    img { max-width:100%; margin:24px 0; }
  </style>
</head>
<body>
  <p class="muted">${escapeHtml(copy.brand.bg)} / ${escapeHtml(copy.brand.en)}</p>
  <h1>${escapeHtml(copy.titleBg)}</h1>
  <p class="muted">${escapeHtml(copy.titleEn)}</p>
  <img src="./infographic.svg" alt="Sofia Tech Ledger infographic"/>
  <ul>${bullets}</ul>
  <table>
    <thead><tr><th>Компания</th><th>Програма</th><th>EUR</th><th>Източник</th></tr></thead>
    <tbody>${awards || "<tr><td colspan=4>Няма нови потвърдени грантове днес.</td></tr>"}</tbody>
  </table>
  <p class="muted">${escapeHtml(copy.disclaimer)}</p>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
