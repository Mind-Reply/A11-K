'use client';

const rows = [
  ['Repository state', 'READY', 'auto'],
  ['Deployment state', 'MONITORED', 'auto'],
  ['Automation state', 'SCHEDULED', 'auto'],
  ['Safe maintenance', 'AUTO', 'auto'],
  ['Evidence capture', 'AUTO', 'auto'],
  ['Consequential action', 'OWNER GATE', 'owner'],
];

const unifiedLanes = [
  ['MASTER INDEX / NOWLINE PULSE', 'Observe estate, launches and opportunity signals'],
  ['MESSAGE-TRIGGERED SKILL MESH', 'Validate changes, PRs, runtime state and evidence'],
  ['CEO SKILL MESH', 'Coordinate owner-control work across the estate'],
  ['INDUSTRIAL OPPORTUNITY RADAR', 'Surface physical opportunities and prepare action packets'],
];

export default function Operations() {
  return (
    <main className="min-h-screen bg-[#070807] px-5 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <a href="/flight-deck">← Flight Deck</a>
        <p className="mt-16 text-[10px] uppercase tracking-[.3em] text-white/35">01 / OPERATIONS</p>
        <h1 className="mt-5 text-5xl font-light tracking-[-.055em] sm:text-7xl">One operating loop.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">Observe the estate, classify the next safe move, execute bounded work, verify it, record evidence and hand off consequential decisions.</p>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[.025] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[.28em] text-white/35">Unified automation</p>
              <h2 className="mt-2 text-3xl font-light tracking-[-.04em]">A11-K Control Loop</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">One owner-facing control surface for the four operating lanes. Routine observation, validation, evidence and preparation stay inside the safe operating boundary.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-300/20 bg-green-300/5 px-4 py-2 text-[10px] uppercase tracking-[.18em] text-green-200"><i className="h-2 w-2 rounded-full bg-green-300" /> ON</span>
          </div>
          <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
            {unifiedLanes.map(([name, body], index) => (
              <article key={name} className="bg-[#0b0c0b] p-5">
                <span className="text-[8px] tracking-[.18em] text-white/25">0{index + 1}</span>
                <h3 className="mt-5 text-[11px] font-medium tracking-[.12em]">{name}</h3>
                <p className="mt-2 text-xs leading-5 text-white/40">{body}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-[10px] uppercase tracking-[.16em] text-white/25">Consequential production, billing, credentials, DNS, external outreach and destructive actions remain owner-gated.</p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 p-6">
            <h2>Observe</h2>
            {rows.slice(0, 3).map((r) => (
              <div className="flex justify-between border-b border-white/10 py-4 text-sm" key={r[0]}>
                <span>{r[0]}</span>
                <b className={r[2] === 'owner' ? 'text-amber-200' : 'text-green-200'}>{r[1]}</b>
              </div>
            ))}
          </article>
          <article className="rounded-2xl border border-white/10 p-6">
            <h2>Execute safely</h2>
            <p className="mt-4 text-white/50">Validation, tests, link health, dependency checks, documentation, content preparation and bounded repository maintenance can run without model services.</p>
            <button type="button" onClick={() => { window.location.href = '/flight-deck'; }} className="mt-6 rounded-xl border border-white/15 px-4 py-3 text-xs uppercase tracking-widest">Run validation →</button>
          </article>
        </section>

        <nav className="mt-8 flex flex-wrap gap-3 text-sm">
          <a href="/automations">Automation matrix →</a>
          <a href="/evidence">Evidence →</a>
          <a href="/recovery">Recovery →</a>
        </nav>
      </div>
    </main>
  );
}
