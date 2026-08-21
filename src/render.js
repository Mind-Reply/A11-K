// Renders the daily Sofia Tech Ledger: HTML report, SVG chart, social text, JSON.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function renderAll(outDir, report) {
  mkdirSync(outDir, { recursive: true });
  const { asOf } = report;
  const files = {
    html: join(outDir, `sofia-tech-ledger-${asOf}.html`),
    svg: join(outDir, `sofia-tech-ledger-${asOf}.svg`),
    social: join(outDir, `sofia-tech-ledger-${asOf}.social.txt`),
    json: join(outDir, `sofia-tech-ledger-${asOf}.json`)
  };
  writeFileSync(files.html, renderHtml(report), 'utf8');
  writeFileSync(files.svg, renderSvg(report), 'utf8');
  writeFileSync(files.social, renderSocial(report), 'utf8');
  writeFileSync(files.json, JSON.stringify(report, null, 2), 'utf8');
  return files;
}

function renderHtml(r) {
  const gapRows = r.gaps.map((g) => `<tr><td>${esc(g.sector)}</td><td>${g.digitalScoreBg.toFixed(1)}</td><td>${g.euAverage.toFixed(1)}</td><td>${g.gap.toFixed(1)}</td></tr>`).join('');
  const regRows = r.todaysRegistrations.map((x) => `<li><strong>${esc(x.name)}</strong> (${esc(x.latin)}) — ${esc(x.sector)}, ${esc(x.city)}${x.techPark ? ' · София Тех Парк' : ''}</li>`).join('');
  const fundRows = r.funding.awards.map((a) => `<li><strong>${esc(a.company)}</strong> — ${esc(a.instrument)} · €${a.amountEur.toLocaleString('en-GB')} · ${esc(a.programme)}</li>`).join('');
  return `<!doctype html>
<html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Софийски Технологичен Регистър — ${r.asOf}</title>
<style>
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#0b1020;color:#e6ecff;margin:0;padding:32px;line-height:1.55}
.wrap{max-width:880px;margin:0 auto}
h1{font-size:1.6rem;margin:0 0 4px} h2{font-size:1.05rem;color:#8fb3ff;margin-top:28px;border-bottom:1px solid #243056;padding-bottom:6px}
.sub{color:#8fa0c9;font-size:.85rem}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-top:16px}
.kpi{background:#131a33;border:1px solid #243056;border-radius:12px;padding:14px}
.kpi .v{font-size:1.4rem;font-weight:700} .kpi .l{color:#8fa0c9;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em}
table{width:100%;border-collapse:collapse;font-size:.9rem} td,th{padding:8px 10px;border-bottom:1px solid #243056;text-align:left} th{color:#8fa0c9}
.bg-block{background:#101736;border-left:3px solid #4f7cff;border-radius:0 10px 10px 0;padding:14px 18px;font-size:.95rem}
.footer{color:#5c6b96;font-size:.75rem;margin-top:32px}
</style></head><body><div class="wrap">
<h1>Софийски Технологичен Регистър <span class="sub">/ The Sofia Tech Ledger</span></h1>
<div class="sub">${r.asOf} · източник: ${r.provider} · ledger #${r.ledger.height}</div>
<div class="kpis">
  <div class="kpi"><div class="v">${r.readiness}/100</div><div class="l">Индекс на цифрова готовност</div></div>
  <div class="kpi"><div class="v">+${r.delta.toFixed(2)}pp</div><div class="l">Дигитална интензивност (дн.)</div></div>
  <div class="kpi"><div class="v">€${r.funding.totalEur.toLocaleString('en-GB')}</div><div class="l">ЕС финансиране днес</div></div>
  <div class="kpi"><div class="v">${r.todaysRegistrations.length}</div><div class="l">Нови тех регистрации</div></div>
  <div class="kpi"><div class="v">$${(r.velocity.totalUsd / 1e6).toFixed(1)}M</div><div class="l">Финтех рундове (7д)</div></div>
  <div class="kpi"><div class="v">${r.nis2.open}</div><div class="l">NIS2 констатации</div></div>
</div>
<h2>Дигитален Монитор — София</h2>
<div class="bg-block">${r.bulletin.bg.map((l) => `<div>${esc(l)}</div>`).join('')}</div>
<h2>English bulletin</h2>
<div class="bg-block">${r.bulletin.en.map((l) => `<div>${esc(l)}</div>`).join('')}</div>
<h2>Изоставане спрямо ЕС по сектори</h2>
<table><tr><th>Сектор</th><th>БГ</th><th>ЕС ср.</th><th>Разлика</th></tr>${gapRows}</table>
<h2>Нови регистрации (${r.asOf})</h2>
<ul>${regRows || '<li>Няма нови записи.</li>'}</ul>
<h2>ЕС финансиране, отпуснато днес</h2>
<ul>${fundRows || '<li>Няма нови отпуснати средства.</li>'}</ul>
<div class="footer">Автоматично генерирано · SHA-256 верифициран регистър · Данните са ${r.provider === 'fixture' ? 'детерминистичен образец — не са пазарни данни' : 'от живи източници'}.</div>
</div></body></html>`;
}

function renderSvg(r) {
  const w = 720, h = 300, pad = 44;
  const series = r.intensitySeries;
  const min = Math.min(...series.map((p) => p.value));
  const max = Math.max(...series.map((p) => p.value));
  const span = Math.max(0.0001, max - min);
  const pts = series.map((p, i) => {
    const x = pad + (i / (series.length - 1)) * (w - 2 * pad);
    const y = h - pad - ((p.value - min) / span) * (h - 2 * pad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="${w}" height="${h}" fill="#0b1020"/>
<text x="${pad}" y="28" fill="#e6ecff" font-family="system-ui" font-size="15" font-weight="700">Дигитална интензивност на софийските МСП (%)</text>
<text x="${w - pad}" y="28" fill="#8fa0c9" font-family="system-ui" font-size="11" text-anchor="end">${r.asOf} · ${r.provider}</text>
<polyline points="${pts}" fill="none" stroke="#4f7cff" stroke-width="2.5"/>
<text x="${pad}" y="${h - 12}" fill="#8fa0c9" font-family="system-ui" font-size="11">${series[0].date}</text>
<text x="${w - pad}" y="${h - 12}" fill="#8fa0c9" font-family="system-ui" font-size="11" text-anchor="end">${series.at(-1).date}</text>
<text x="${w - pad}" y="${pad - 16}" fill="#7ee2a8" font-family="system-ui" font-size="13" font-weight="700" text-anchor="end">${series.at(-1).value.toFixed(2)}%</text>
</svg>`;
}

function renderSocial(r) {
  return [
    ...r.bulletin.bg,
    '',
    ...r.bulletin.en,
    '',
    `Индекс на цифрова готовност: ${r.readiness}/100 | Readiness Index: ${r.readiness}/100`,
    `#София #DigitalBG #ЕСфондове #SofiaTech`
  ].join('\n');
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
