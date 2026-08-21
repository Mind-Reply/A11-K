// Tamper-evident append-only publication ledger (same design as financial-momentum-ledger).
// JSONL, SHA-256 hash chain, GENESIS root, idempotent per session date.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

const GENESIS = 'GENESIS';

export function hashPayload(payload) {
  const stable = JSON.stringify(payload, Object.keys(payload).sort());
  return createHash('sha256').update(stable).digest('hex');
}

export function appendEntry(outDir, date, payload) {
  const dir = join(outDir, 'ledger');
  mkdirSync(dir, { recursive: true });
  const file = join(dir, 'ledger.jsonl');
  const entries = readEntries(outDir);
  if (entries.some((e) => e.date === date)) {
    return { appended: false, reason: 'duplicate-date', height: entries.length, tip: entries.at(-1)?.hash ?? GENESIS };
  }
  const prevHash = entries.at(-1)?.hash ?? GENESIS;
  const payloadHash = hashPayload(payload);
  const hash = createHash('sha256').update(`${prevHash}:${date}:${payloadHash}`).digest('hex');
  const entry = { seq: entries.length, date, prevHash, payloadHash, hash };
  appendFileSync(file, JSON.stringify(entry) + '\n', 'utf8');
  return { appended: true, height: entries.length + 1, tip: hash, entry };
}

export function readEntries(outDir) {
  const file = join(outDir, 'ledger', 'ledger.jsonl');
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

export function verifyLedger(outDir) {
  const entries = readEntries(outDir);
  let prev = GENESIS;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.seq !== i) return { ok: false, reason: `bad-seq@${i}` };
    if (e.prevHash !== prev) return { ok: false, reason: `bad-prev@${i}` };
    const expected = createHash('sha256').update(`${e.prevHash}:${e.date}:${e.payloadHash}`).digest('hex');
    if (expected !== e.hash) return { ok: false, reason: `bad-hash@${i}` };
    prev = e.hash;
  }
  return { ok: true, height: entries.length, tip: prev };
}
