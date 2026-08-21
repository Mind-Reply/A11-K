// Live adapter: TED eForms Search API v3 (anonymous, published notices).
// Pulls recent Bulgarian digitalization-relevant procurement: ICT CPV codes
// (48xxxxxx software, 72xxxxxx IT services) with buyers, winners, values.

const ENDPOINT = 'https://api.ted.europa.eu/v3/notices/search';

const CPV = [
  { code: '48000000', label: 'Software' },
  { code: '72000000', label: 'IT services' },
  { code: '30200000', label: 'Computer equipment' }
];

const FIELDS = [
  'publication-number', 'notice-title', 'buyer-name', 'publication-date',
  'winner-name', 'total-value', 'winner-country', 'classification-cpv'
];

export async function fetchTedDigitalProcurement({ limit = 8, timeoutMs = 15_000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const cpvClause = `(${CPV.map((c) => `PC = ${c.code}`).join(' OR ')})`;
  const query = `buyer-country = BGR AND ${cpvClause}`;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        query,
        fields: FIELDS,
        limit,
        scope: 'ACTIVE',
        paginationMode: 'PAGE_NUMBER',
        page: 1
      })
    });
    if (!res.ok) return { ok: false, reason: `http-${res.status}` };
    const json = await res.json();
    const notices = (json.notices ?? []).map(normalizeNotice);
    return {
      ok: true,
      total: json.totalNoticeCount ?? 0,
      notices,
      cpvCovered: CPV,
      fetchedAt: new Date().toISOString()
    };
  } catch (err) {
    return { ok: false, reason: err.name === 'AbortError' ? 'timeout' : String(err.message || err) };
  } finally {
    clearTimeout(timer);
  }
}

function normalizeNotice(n) {
  return {
    id: n['publication-number'] ?? null,
    title: pickLang(n['notice-title']),
    buyer: pickLang(n['buyer-name']),
    winner: pickLang(n['winner-name']),
    publishedAt: n['publication-date'] ?? null,
    totalValue: n['total-value'] ?? null,
    winnerCountry: n['winner-country'] ?? null,
    cpv: n['classification-cpv'] ?? null
  };
}

function pickLang(field) {
  if (field == null) return null;
  if (typeof field === 'string') return field;
  if (Array.isArray(field)) return pickLang(field[0]);
  if (typeof field === 'object') return field.eng ?? field.bul ?? Object.values(field)[0] ?? null;
  return String(field);
}
