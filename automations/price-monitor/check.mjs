import fs from 'node:fs/promises';
import net from 'node:net';
import { URL } from 'node:url';

const registryPath = process.env.PRICE_MONITOR_REGISTRY || new URL('./targets.json', import.meta.url);
const outputPath = process.env.PRICE_MONITOR_OUTPUT || 'price-monitor-results.json';

function isPrivateIp(hostname) {
  const ip = net.isIP(hostname);
  if (!ip) return false;
  if (ip === 4) {
    const [a, b] = hostname.split('.').map(Number);
    return a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
  }
  const normalized = hostname.toLowerCase();
  return normalized === '::1' || normalized.startsWith('fc') || normalized.startsWith('fd') || normalized.startsWith('fe80:');
}

function assertSafeUrl(raw, allowedHosts) {
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error('Only HTTPS targets are allowed');
  if (isPrivateIp(url.hostname)) throw new Error('Private or local target is not allowed');
  if (!allowedHosts.includes(url.hostname.toLowerCase())) throw new Error(`Host is not allowlisted: ${url.hostname}`);
  return url;
}

function parsePrice(raw) {
  const normalized = raw.replace(/\s/g, '').replace(/[^0-9,.-]/g, '');
  if (!normalized) return null;
  const lastComma = normalized.lastIndexOf(',');
  const lastDot = normalized.lastIndexOf('.');
  let value = normalized;
  if (lastComma > lastDot) value = normalized.replace(/\./g, '').replace(',', '.');
  else value = normalized.replace(/,/g, '');
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

async function fetchTarget(target) {
  let url = assertSafeUrl(target.url, target.allowedHosts.map(h => h.toLowerCase()));
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'A11K-Price-Monitor/1.0', accept: 'text/html,text/plain;q=0.9' },
    signal: AbortSignal.timeout(20_000)
  });
  url = assertSafeUrl(response.url, target.allowedHosts.map(h => h.toLowerCase()));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html') && !contentType.includes('text/plain')) throw new Error(`Unsupported content type: ${contentType}`);
  return { url: url.toString(), text: await response.text() };
}

async function main() {
  const registry = JSON.parse(await fs.readFile(registryPath, 'utf8'));
  const targets = Array.isArray(registry.targets) ? registry.targets : [];
  const checkedAt = new Date().toISOString();
  const results = [];

  for (const target of targets) {
    const base = { id: target.id, checkedAt, expectedCurrency: target.currency, sourceUrl: target.url };
    try {
      if (!target.id || !target.url || !Array.isArray(target.allowedHosts) || !target.pricePattern) {
        throw new Error('Invalid target contract');
      }
      const { url, text } = await fetchTarget(target);
      const match = new RegExp(target.pricePattern, 'i').exec(text);
      if (!match?.[1]) {
        results.push({ ...base, status: 'UNVERIFIED', finalUrl: url, reason: 'Price pattern did not produce a numeric capture' });
        continue;
      }
      const price = parsePrice(match[1]);
      if (price === null) {
        results.push({ ...base, status: 'UNVERIFIED', finalUrl: url, reason: 'Captured value is not numeric' });
        continue;
      }
      const alert = Number.isFinite(target.below) && price <= Number(target.below);
      results.push({
        ...base,
        status: alert ? 'ALERT' : 'OK',
        finalUrl: url,
        observedPrice: price,
        threshold: Number.isFinite(target.below) ? Number(target.below) : null,
        evidence: { match: match[0].slice(0, 200) }
      });
    } catch (error) {
      results.push({ ...base, status: 'FAILED', reason: error instanceof Error ? error.message : String(error) });
    }
  }

  const summary = {
    schema: 'a11k.price-observation/v1',
    checkedAt,
    total: results.length,
    ok: results.filter(r => r.status === 'OK').length,
    alerts: results.filter(r => r.status === 'ALERT').length,
    unverified: results.filter(r => r.status === 'UNVERIFIED').length,
    failed: results.filter(r => r.status === 'FAILED').length
  };
  await fs.writeFile(outputPath, JSON.stringify({ summary, results }, null, 2) + '\n');
  console.log(JSON.stringify(summary));
  if (summary.failed > 0) process.exitCode = 1;
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
