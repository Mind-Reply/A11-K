'use client';

import { useEffect, useMemo, useState } from 'react';

const nav = [
  ['Overview', '/flight-deck'],
  ['Operations', '/operations'],
  ['Deployments', '/estate'],
  ['Automations', '/automations'],
  ['Evidence', '/evidence'],
  ['Recovery', '/recovery'],
  ['Revenue', '/revenue'],
];

const actions = [
  ['Run estate check', 'Validate connected surfaces and runtime health', '/operations'],
  ['Review deployments', 'Inspect delivery state before promoting changes', '/estate'],
  ['Inspect automation', 'Review running, gated and failed workflows', '/automations'],
  ['Open recovery', 'Check rollback and fail-closed paths', '/recovery'],
];

const signals = [
  ['Runtime', 'Deterministic validation', 'green'],
  ['Deployments', 'Owner-gated promotion', 'amber'],
  ['Integrations', 'Connection posture', 'blue'],
  ['Evidence', 'Verification boundary', 'green'],
];

export default function FlightDeckPage() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [query, setQuery] = useState('');

  async function runChecks() {
    setRunning(true);
    try {
      const response = await fetch('/api/autonomy/run', { method: 'POST', cache: 'no-store' });
      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : 'request failed' });
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    runChecks();
  }, []);

  const filteredActions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return actions;
    return actions.filter(([name, body]) => `${name} ${body}`.toLowerCase().includes(term));
  }, [query]);

  return (
    <main className="min-h-screen bg-[#070807] text-white">
      <div className="gridlines" />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[232px] shrink-0 border-r border-white/10 bg-black/20 p-5 lg:flex lg:flex-col">
          <a href="/flight-deck" className="no-underline">
            <div className="text-sm font-semibold tracking-[.24em]">A11-K</div>
            <div className="mt-1 text-[8px] uppercase tracking-[.28em] text-white/25">Private command plane</div>
          </a>
          <div className="mt-10 space-y-1">
            {nav.map(([label, href], index) => (
              <a key={href} href={href} className={`group flex items-center justify-between rounded-xl px-3 py-3 text-[10px] uppercase tracking-[.14em] no-underline transition ${index === 0 ? 'bg-white/[.07] text-white' : 'text-white/38 hover:bg-white/[.04] hover:text-white'}`}>
                <span>{label}</span><span className="text-white/15 group-hover:text-white/35">↗</span>
              </a>
            ))}
          </div>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.025] p-4">
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[.16em] text-white/45"><i className="live" /> Owner mode</div>
            <p className="mt-3 text-xs leading-5 text-white/38">Production actions stay behind explicit policy gates.</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070807]/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
              <div className="flex min-w-0 items-center gap-4">
                <span className="text-[9px] uppercase tracking-[.24em] text-white/28">Flight deck</span>
                <span className="hidden h-4 w-px bg-white/10 sm:block" />
                <span className="truncate text-xs text-white/42">Private systems control</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden rounded-full border border-white/10 px-3 py-2 text-[8px] uppercase tracking-[.16em] text-white/35 sm:block">Main · protected</span>
                <button onClick={runChecks} disabled={running} className="rounded-xl border border-white/15 bg-white text-[#070807] px-3.5 py-2.5 text-[9px] font-semibold uppercase tracking-[.14em] transition hover:-translate-y-0.5 disabled:opacity-50">{running ? 'Checking' : 'Recheck'}</button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-7 sm:px-8 sm:pt-9">
            <section className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[.025] p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <div className="eyebrow">System state / now</div>
                    <h1 className="mt-3 max-w-3xl text-4xl font-light tracking-[-.055em] sm:text-6xl">Command the estate.<br/><span className="text-white/28">See the proof.</span></h1>
                    <p className="mt-5 max-w-2xl text-sm leading-6 text-white/42">One operational surface for runtime health, delivery, workflows, evidence and recovery. Designed around decisions, not backend screens.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                    <div className="text-[8px] uppercase tracking-[.2em] text-white/25">Control state</div>
                    <div className="mt-2 flex items-center justify-end gap-2 text-xs text-white/70"><i className="live" /> {result?.ok ? 'Nominal' : result ? 'Attention' : 'Checking'}</div>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {signals.map(([name, body, tone]) => (
                    <div key={name} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                      <div className="flex items-center justify-between"><span className="text-[9px] uppercase tracking-[.16em] text-white/28">{name}</span><span className={`h-2 w-2 rounded-full ${tone === 'green' ? 'bg-emerald-300' : tone === 'amber' ? 'bg-amber-300' : 'bg-sky-300'}`} /></div>
                      <div className="mt-7 text-xs text-white/68">{body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[.055] to-transparent p-6 sm:p-8">
                <div className="eyebrow">Verification pulse</div>
                <div className="mt-7 grid place-items-center py-4">
                  <div className="relative grid h-44 w-44 place-items-center rounded-full border border-white/10">
                    <div className="absolute inset-5 rounded-full border border-white/10" />
                    <div className="absolute inset-12 rounded-full bg-white/[.07] shadow-[0_0_80px_rgba(205,232,199,.16)]" />
                    <div className="relative text-center"><div className="text-4xl font-light tracking-[-.06em]">{result?.ok ? 'OK' : result ? '!' : '···'}</div><div className="mt-1 text-[8px] uppercase tracking-[.25em] text-white/35">runtime</div></div>
                  </div>
                </div>
                <div className="mt-5 border-t border-white/10 pt-5 text-[10px] leading-5 text-white/38">{result ? `${result.ok ? 'Validation passed.' : 'Validation requires attention.'} ${result.evidence?.source ?? 'Runtime evidence available.'}` : 'Running the bounded production validation.'}</div>
              </div>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
              <div className="rounded-[28px] border border-white/10 bg-white/[.02] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div><div className="eyebrow">Dispatch</div><h2 className="mt-2 text-2xl font-light tracking-[-.035em]">What needs doing?</h2></div>
                  <div className="relative"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter actions" className="w-44 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/20 focus:border-white/25" /></div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {filteredActions.map(([name, body, href], index) => (
                    <a key={name} href={href} className="group rounded-2xl border border-white/10 bg-black/10 p-5 no-underline transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[.04]">
                      <div className="flex justify-between"><span className="font-mono text-[9px] text-white/22">0{index + 1}</span><span className="text-white/20 transition group-hover:text-white/65">↗</span></div>
                      <h3 className="mt-8 text-sm font-medium text-white/85">{name}</h3>
                      <p className="mt-2 text-xs leading-5 text-white/35">{body}</p>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[.02] p-6 sm:p-8">
                <div className="eyebrow">Last validation</div>
                <div className="mt-3 text-2xl font-light tracking-[-.035em]">Runtime evidence</div>
                <div className="mt-6 space-y-2">
                  {['Estate health', 'Revenue health'].map((label) => {
                    const key = label.startsWith('Estate') ? 'estate' : 'revenue';
                    const item = result?.checks?.[key];
                    return <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3"><span className="text-xs text-white/55">{label}</span><span className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-white/35"><i className={`h-1.5 w-1.5 rounded-full ${item?.status === 'healthy' || item?.ok ? 'bg-emerald-300' : result ? 'bg-amber-300' : 'bg-white/20'}`} />{item ? (item.ok === false ? 'attention' : 'verified') : 'pending'}</span></div>;
                  })}
                </div>
                {result && <pre className="mt-4 max-h-40 overflow-auto rounded-xl bg-black/30 p-4 text-[9px] leading-5 text-white/32">{JSON.stringify(result, null, 2)}</pre>}
              </div>
            </section>

            <footer className="mt-7 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[8px] uppercase tracking-[.24em] text-white/22 sm:flex-row"><span>A11-K · Mind-Reply</span><span>Deterministic · Evidence-gated · Owner-accountable · © 2026</span></footer>
          </div>
        </div>
      </div>
    </main>
  );
}
