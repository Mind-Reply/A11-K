// Live adapter: Eurostat dissemination API (public, no key).
// Dataset isoc_e_dii — Digital Intensity Index of enterprises.
// Pulls very-high DII (E_DI4_VHI) for SMEs (10-249 employees) for Bulgaria
// and the EU-27 aggregate, with correct JSON-stat flat-index math.

const BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/isoc_e_dii';
const INDIC = 'E_DI4_VHI';
const SIZE = '10-249';
const GEOS = ['BG', 'EU27_2020'];

export async function fetchEurostatDigitalIntensity({ timeoutMs = 12_000 } = {}) {
  const url = `${BASE}?format=JSON&lang=EN&unit=PC_ENT&indic_is=${INDIC}&size_emp=${SIZE}${GEOS.map((g) => `&geo=${g}`).join('')}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json' } });
    if (!res.ok) return { ok: false, reason: `http-${res.status}` };
    const json = await res.json();
    const parsed = parseJsonStatMulti(json);
    if (!parsed.BG.length) return { ok: false, reason: 'empty-series' };
    return { ok: true, ...parsed, source: `eurostat:isoc_e_dii/${INDIC}`, fetchedAt: new Date().toISOString() };
  } catch (err) {
    return { ok: false, reason: err.name === 'AbortError' ? 'timeout' : String(err.message || err) };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Parse a multi-dimension JSON-stat response.
 * Dimension order in `id` defines strides: last dimension is contiguous.
 * Returns { BG: [{date,value}], EU27: [{date,value}] } sorted ascending.
 */
export function parseJsonStatMulti(json) {
  const ids = json?.id ?? [];
  const sizes = json?.size ?? [];
  const dims = Object.fromEntries(ids.map((d, i) => [d, { size: sizes[i], index: json.dimension?.[d]?.category?.index ?? {} }]));
  const values = json?.value ?? {};

  // stride of dimension i = product of sizes of dimensions after i
  const strides = ids.map((_, i) => ids.slice(i + 1).reduce((acc, d) => acc * (dims[d].size || 1), 1));

  const out = { BG: [], EU27: [] };
  for (const [flat, v] of Object.entries(values)) {
    if (v == null) continue;
    let n = Number(flat);
    const coord = {};
    for (let i = 0; i < ids.length; i++) {
      const idx = Math.floor(n / strides[i]);
      n %= strides[i];
      const cat = Object.entries(dims[ids[i]].index).find(([, ci]) => ci === idx)?.[0];
      coord[ids[i]] = cat;
    }
    const key = coord.geo === 'BG' ? 'BG' : coord.geo === 'EU27_2020' ? 'EU27' : null;
    if (key && coord.time) out[key].push({ date: `${coord.time}-01-01`, value: Number(v) });
  }
  out.BG.sort((a, b) => a.date.localeCompare(b.date));
  out.EU27.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

/** Back-compat single-series parser (used by tests and simple callers). */
export function parseJsonStat(json) {
  const timeDim = json?.dimension?.time;
  const indexMap = timeDim?.category?.index ?? {};
  const values = json?.value ?? {};
  const years = Object.entries(indexMap).sort((a, b) => a[1] - b[1]).map(([year]) => year);
  const out = [];
  for (const [flatIdx, v] of Object.entries(values)) {
    const year = years[Number(flatIdx)];
    if (year != null && v != null) out.push({ date: `${year}-01-01`, value: Number(v) });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export function toIntensitySeries(eurostatSeries) {
  return eurostatSeries.map((p) => ({ date: p.date, value: p.value }));
}
