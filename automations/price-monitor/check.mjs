import fs from 'node:fs/promises';
import net from 'node:net';
import dns from 'node:dns/promises';
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

async function assertSafeUrl(raw, allowedHosts) {
  const url = new URL(raw);
  const hostname = url.hostname.toLowerCase();
  if (url.protocol !== 'https:') throw new Error('Only HTTPS targets are allowed');
  if (isPrivateIp(hostname)) throw new Error('Private or local target is not allowed');
  if (!allowedHosts.includes(hostname)) throw new Error(`Host is not allowlisted: ${hostname}`);

  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length) throw new Error('Target hostname did not resolve');
  if (addresses.some(({ address }) => isPrivateIp(address))) {
    throw new Error('Target hostname resolves to a private or local address');
  }
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

function validateTarget(target) {
  if (!target || typeof target !== 'object') throw new Error('Invalid target contract');
  if (typeof target.id !== 'string' || !target.id.trim()) throw new Error('Target id is required');
  if (typeof target.url !== 'string' || !target.url.trim()) throw new Error('Target url is required');
  if (!Array.isArray(target.allowedHosts) || target.allowedHosts.length === 0) throw new Error('allowedHosts is required');
  if (target.allowedHosts.some(host => typeof host !== 'string' || host !== host.toLowerCase())) {
    throw new Error('allowedHosts must contain lowercase hostnames');
  }
  if (typeof target.pricePattern !== 'string' || !target.pricePattern) throw new Error('pricePattern is required');
  if (target.below !== undefined && (!Number.isFinite(Number(target.below)) || Number(target.below) < 0)) {
    throw new Error('below must be a non-negative number');
  }
  if (typeof target.currency !== 'string' || !/^[A-Z]{3}$/.test(target.currency)) throw new Error('currency must be an ISO 4217 code');
}

async function fetchTarget(target) {
  let url = await assertSafeUrl(target.url, target.allowedHosts);
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'A11K-Price-Monitor/1.1', accept: 'text/html,text/plain;q=0.9' },
    signal: AbortSignal.timeout(20_000)
  });
  url = await assertSafeUrl(response.url, target.allowedHosts);
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
    const base = { id: target?.id, checkedAt, expectedCurrency: target?.currency, sourceUrl: target?.url };
    try {
      validateTarget(target);
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
