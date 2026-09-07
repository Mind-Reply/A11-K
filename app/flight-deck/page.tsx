'use client';

import { useState } from 'react';

const modules = [
  ['Operations', 'Observe, validate, decide and record.', '/operations.html'],
  ['Revenue', 'Check the deterministic commercial path.', '/revenue'],
  ['Automations', 'See autonomous and owner-gated actions.', '/automations.html'],
  ['Evidence', 'Inspect evidence boundaries and status.', '/evidence.html'],
  ['Recovery', 'Review fail-closed recovery paths.', '/recovery.html'],
  ['Estate Map', 'See products, systems and delivery surfaces.', '/estate.html'],
];

export default function FlightDeckPage() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function runChecks() {
    setRunning(true);
    setResult(null);
    try {
      const response = await fetch('/api/autonomy/run', { method: 'POST', cache: 'no-store' });
      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : 'request failed' });
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070807] px-5 py-8 text-white sm:px-10 sm:py-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[.3em] text-white/35">A11-K / executable flight deck</p>
            <h1 className="mt-5 text-5xl font-light tracking-[-.055em] sm:text-7xl">Watch. Act.<br /><span className="text-white/30">Prove.</span></h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/50">This surface performs bounded runtime validation instead of merely describing autonomy. No model, money movement, DNS, credential mutation or destructive action is required.</p>
          </div>
          <button onClick={runChecks} disabled={running} className="rounded-2xl border border-white/15 bg-white/[.04] px-5 py-4 text-[10px] uppercase tracking-[.18em] transition hover:bg-white/[.08] disabled:opacity-40">
            {running ? 'Running checks…' : 'Run live checks'}
          </button>
        </header>

        <section className="py-10">
          {result && (
            <div className={`rounded-2xl border p-6 ${result.ok ? 'border-white/15' : 'border-white/25'}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <strong className="text-sm">{result.ok ? 'VALIDATION PASSED' : 'VALIDATION REQUIRES ATTENTION'}</strong>
                <span className="text-[9px] uppercase tracking-[.18em] text-white/35">{result.evidence?.generatedAt ?? 'runtime result'}</span>
              </div>
              <p className="mt-3 text-sm text-white/50">Mode: {result.autonomous ? 'bounded autonomous validation' : 'runtime error'} · Model required: {String(result.modelRequired ?? false)} · External writes: {String(result.externalWrites ?? false)}</p>
              <pre className="mt-5 overflow-auto rounded-xl bg-black/30 p-4 text-[10px] leading-5 text-white/55">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(([name, body, href], i) => (
            <a key={name} href={href} className="rounded-2xl border border-white/10 bg-white/[.025] p-6 no-underline transition hover:-translate-y-0.5 hover:bg-white/[.05]">
              <span className="font-mono text-[9px] text-white/25">0{i + 1}</span>
              <h2 className="mt-8 text-lg font-medium">{name}</h2>
              <p className="mt-3 text-sm leading-6 text-white/45">{body}</p>
              <span className="mt-6 inline-block text-[9px] uppercase tracking-[.18em] text-white/40">Open module ↗</span>
            </a>
          ))}
        </section>

        <footer className="mt-12 border-t border-white/10 pt-7 text-[9px] uppercase tracking-[.25em] text-white/25">A11-K · Deterministic · Evidence-gated · Human-accountable · © 2026</footer>
      </div>
    </main>
  );
}
