export async function fetchEurostatDigitalIntensity(url) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Eurostat ${response.status}`);
  }
  const payload = await response.json();
  const geoIndex = payload.id?.indexOf("geo") ?? -1;
  const timeIndex = payload.id?.indexOf("time") ?? -1;
  const indicIndex = payload.id?.indexOf("indic_is") ?? payload.id?.indexOf("indic") ?? -1;
  const sizeIndex = payload.id?.indexOf("size_emp") ?? payload.id?.indexOf("sizen_r2") ?? -1;
  const dims = payload.dimension || {};
  const values = payload.value || {};
  const series = [];

  for (const [flatKey, value] of Object.entries(values)) {
    const parts = String(flatKey).split(":").map(Number);
    const geo = lookup(dims, payload.id, geoIndex, parts);
    const time = lookup(dims, payload.id, timeIndex, parts);
    const indicator = lookup(dims, payload.id, indicIndex, parts);
    const size = lookup(dims, payload.id, sizeIndex, parts);
    if (geo !== "BG" || value == null || !time) continue;
    series.push({
      date: `${time}-12-31`,
      value: Number(value),
      indicator,
      size,
      source: "Eurostat isoc_e_dii",
    });
  }

  return series.sort((a, b) => a.date.localeCompare(b.date));
}

function lookup(dims, ids, index, parts) {
  if (index < 0 || !ids?.[index]) return null;
  const dim = dims[ids[index]];
  const code = Object.keys(dim?.category?.index || {}).find((key) => dim.category.index[key] === parts[index]);
  return code || null;
}
