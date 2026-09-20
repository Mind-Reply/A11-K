import Link from 'next/link';

const metrics = [
  ['SIGNALS', 'Sector movement, funding and registry events'],
  ['CONTROL', 'Owner-approved operations and deployment state'],
  ['PROOF', 'Evidence separated from emerging signals'],
];

const products = [
  ['Sofia Tech Ledger', 'Regional intelligence for Sofia and Bulgaria.', '/sofia-tech-ledger', 'INTELLIGENCE'],
  ['A11-K Command', 'Private operations, deployments, recovery and evidence.', '/flight-deck', 'CONTROL'],
  ['Proof View', 'A clear boundary between verified facts and signals.', '/a11-sites.html', 'EVIDENCE'],
];

const revenueSteps = ['OFFER', 'LANDING', 'CTA', 'CHECKOUT', 'PAYMENT', 'FULFILMENT', 'RECORD', 'REPEAT'];

const operatingLoop = [
  ['01', 'UNDERSTAND', 'Frame the objective, context and constraints.'],
  ['02', 'PROTECT', 'Keep authority, credentials and irreversible actions gated.'],
  ['03', 'EXECUTE', 'Move approved work through controlled workflows.'],
  ['04', 'VERIFY', 'Check the result against the live surface and evidence.'],
  ['05', 'RECORD', 'Leave a durable trail for review and handoff.'],
];

export default function Home() {
  return <main className="min-h-screen overflow-hidden bg-[#070807] text-white">
    <div className="gridlines" />
    <div className="glow glow-a" />
    <div className="glow glow-b" />

    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
      <Link href="/" className="no-underline">
        <div className="text-sm font-semibold tracking-[.25em]">A11-K</div>
        <div className="mt-1 text-[9px] uppercase tracking-[.3em] text-white/30">Mind-Reply · Private command layer</div>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/flight-deck" className="hidden rounded-full border border-white/15 bg-white/[.04] px-4 py-2 text-[9px] uppercase tracking-[.16em] text-white/65 no-underline transition hover:border-white/30 hover:text-white md:block">Open command</Link>
        <Link href="#products" className="hidden text-[9px] uppercase tracking-[.18em] text-white/35 transition hover:text-white md:block">Surfaces</Link>
        <span className="badge"><i /> Evidence gated</span>
      </div>
    </nav>

    <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-10 lg:py-28">
      <div>
        <p className="eyebrow">PRIVATE COMMAND LAYER · SOFIA · EU</p>
        <h1 className="mt-6 max-w-5xl text-6xl font-light leading-[.9] tracking-[-.065em] sm:text-8xl lg:text-[7.2rem]">
          See what matters.<br /><span className="muted">Move with proof.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-white/50 sm:text-xl">
          A11-K brings intelligence, operations, delivery and commercial systems into one evidence-gated surface built for clear decisions and controlled execution.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/flight-deck" className="button">Open command center <span>↗</span></Link>
          <Link href="/sofia-tech-ledger" className="rounded-[14px] border border-white/15 px-[18px] py-4 text-[13px] text-white transition hover:-translate-y-0.5 hover:border-white/30">Explore intelligence <span>↗</span></Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-[9px] uppercase tracking-[.18em] text-white/30">
          <span>Owner control</span><span>·</span><span>Fail closed</span><span>·</span><span>Durable record</span>
        </div>
      </div>

      <div id="signals" className="signal-card">
        <div className="card-top"><span>01 / SYSTEM PULSE</span><span>PRIVATE</span></div>
        <div className="pulse">
          <div className="pulse-ring ring-1" />
          <div className="pulse-ring ring-2" />
          <div className="pulse-core"><span>A11</span><small>CONTROL PLANE</small></div>
        </div>
        <div className="signal-label"><span className="live" /> observe · validate · act · prove</div>
      </div>
    </section>

    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 lg:px-10">
      <div className="grid border-t border-white/10 md:grid-cols-3">
        {metrics.map(([name, body], i) => <article className="metric group" key={name}>
          <span>0{i + 1}</span><h2>{name}</h2><p>{body}</p>
        </article>)}
      </div>
    </section>

    <section id="loop" className="relative z-10 mx-auto max-w-7xl px-6 pb-20 lg:px-10">
      <div className="rounded-3xl border border-white/10 bg-white/[.025] p-7 sm:p-10">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><p className="eyebrow">THE OPERATING LOOP</p><h2 className="mt-3 text-3xl font-light tracking-[-.04em] sm:text-5xl">Fast enough to move. Governed enough to trust.</h2></div>
          <span className="text-[9px] uppercase tracking-[.2em] text-white/25">05 stages</span>
        </div>
        <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-5">
          {operatingLoop.map(([number, title, body]) => <article key={number} className="bg-[#0b0c0b] p-5 transition hover:bg-white/[.06]">
            <span className="text-[8px] tracking-[.18em] text-white/25">{number}</span>
            <h3 className="mt-10 text-[11px] font-medium tracking-[.16em]">{title}</h3>
            <p className="mt-3 text-xs leading-5 text-white/40">{body}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section id="revenue" className="relative z-10 mx-auto max-w-7xl px-6 pb-20 lg:px-10">
      <div className="rounded-3xl border border-white/10 bg-white/[.025] p-7 sm:p-10">
        <p className="eyebrow">EXECUTION PRINCIPLE</p>
        <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div><h2 className="max-w-3xl text-3xl font-light tracking-[-.04em] sm:text-5xl">Automation without surrendering control.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">Routine work can move through controlled workflows; consequential changes remain policy-gated, verifiable and reversible.</p></div>
          <Link href="/flight-deck" className="button whitespace-nowrap">Go to command <span>↗</span></Link>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4 lg:grid-cols-8">
          {revenueSteps.map((step, i) => <div key={step} className="bg-[#0b0c0b] px-3 py-5 text-center"><span className="text-[8px] tracking-[.18em] text-white/25">0{i + 1}</span><div className="mt-2 text-[9px] tracking-[.12em] text-white/65">{step}</div></div>)}
        </div>
      </div>
    </section>

    <section id="products" className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-10">
      <div className="mb-8 flex items-end justify-between gap-5">
        <div><p className="eyebrow">A11-K / SURFACES</p><h2 className="mt-3 text-3xl font-light tracking-[-.04em] sm:text-5xl">Signal, command, proof.</h2></div>
        <span className="hidden text-[9px] uppercase tracking-[.2em] text-white/25 sm:block">03 / 03</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {products.map(([name, body, href, type], i) => <Link key={href} href={href} className="group rounded-2xl border border-white/10 bg-white/[.025] p-7 no-underline transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[.05]">
          <div className="flex items-center justify-between"><span className="text-[9px] tracking-[.2em] text-white/25">0{i + 1}</span><span className="text-[8px] tracking-[.18em] text-white/25">{type}</span></div>
          <h3 className="mt-14 text-xl font-medium tracking-[-.02em]">{name}</h3>
          <p className="mt-3 text-sm leading-6 text-white/40">{body}</p>
          <span className="mt-7 inline-block text-[10px] uppercase tracking-[.16em] text-white/45 transition group-hover:text-white">Open surface ↗</span>
        </Link>)}
      </div>
    </section>

    <footer className="border-t border-white/10 px-6 py-7 text-[9px] uppercase tracking-[.28em] text-white/25 lg:px-10">
      <div className="mx-auto flex max-w-7xl justify-between gap-5"><span>A11-K · Mind-Reply</span><span>© 2026 · Evidence-gated · Human-accountable</span></div>
    </footer>
  </main>;
}
