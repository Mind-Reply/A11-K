export async function searchEgovPackages(url) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`data.egov.bg ${response.status}`);
  }
  const payload = await response.json();
  const results = payload?.result?.results || [];
  return results.map((item) => ({
    id: item.id,
    name: item.name,
    title: item.title,
    notes: item.notes,
    organization: item.organization?.title || item.organization?.name || null,
    metadataCreated: item.metadata_created || null,
    metadataModified: item.metadata_modified || null,
    source: "data.egov.bg",
  }));
}
