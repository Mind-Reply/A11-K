// Live adapter: Bulgarian Open Data Portal (data.egov.bg) — Laravel REST, no key.
// Discovers registry datasets (commercial register, NIS2-adjacent, public ICT).

const BASE = 'https://data.egov.bg/api';

export async function searchEgovDatasets(keyword, { rowsPerPage = 5, timeoutMs = 12_000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}/listDatasets`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ criteria: { search_keyword: keyword }, rows_per_page: rowsPerPage, page_number: 1 })
    });
    if (!res.ok) return { ok: false, reason: `http-${res.status}` };
    const json = await res.json();
    if (!json?.success) return { ok: false, reason: 'api-failure' };
    const datasets = (json.datasets ?? []).map((d) => ({
      id: d.id,
      uri: d.uri,
      name: d.name,
      orgId: d.org_id,
      orgName: d.org_name ?? null,
      updatedAt: d.updated_at ?? d.modified_at ?? null,
      resources: (d.resources ?? []).length
    }));
    return { ok: true, total: json.total_records ?? 0, datasets, fetchedAt: new Date().toISOString() };
  } catch (err) {
    return { ok: false, reason: err.name === 'AbortError' ? 'timeout' : String(err.message || err) };
  } finally {
    clearTimeout(timer);
  }
}

/** Registry discovery bundle for the ledger's sourcing map. */
export async function fetchEgovRegistryDiscovery(opts = {}) {
  const keywords = ['търговски регистър', 'регистър на дружествата', 'електронни вписвания'];
  const results = await Promise.all(keywords.map((k) => searchEgovDatasets(k, opts)));
  const merged = [];
  const seen = new Set();
  for (const r of results) {
    if (!r.ok) continue;
    for (const d of r.datasets) {
      if (!seen.has(d.uri)) { seen.add(d.uri); merged.push(d); }
    }
  }
  return {
    ok: results.some((r) => r.ok),
    keywords,
    totalDatasets: merged.length,
    datasets: merged.slice(0, 12),
    fetchedAt: new Date().toISOString()
  };
}
