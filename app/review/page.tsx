const pages = [
  ['Home', '/', 'Public entry surface'],
  ['Capability', '/capability', 'Execution and verification proof'],
  ['Copilot', '/copilot.html', 'Planning workspace'],
  ['Sofia Tech Ledger', '/sofia-tech-ledger', 'Regional intelligence surface'],
  ['Proof View', '/a11-sites.html', 'Evidence and site inventory'],
  ['Checkout', '/checkout', 'Commercial conversion path'],
];

const operatingLoop = [
  ['01', 'DISCOVER', 'Enumerate the declared surfaces and their source ownership.'],
  ['02', 'CHECK', 'Review routes, links, deployment state and visible failures.'],
  ['03', 'QUALIFY', 'Separate verified, partial and unresolved states.'],
  ['04', 'ACT', 'Keep the commercial path executable without a model dependency.'],
  ['05', 'RECORD', 'Leave explicit evidence for the next operating cycle.'],
];

export default function ReviewPage() {
  return (
    <main className="min-h-screen bg-[#070807] px-6 py-14 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[.3em] text-white/35">A11-K / autonomous page review</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-light tracking-[-.055em] sm:text-7xl">Review the estate.<br /><span className="text-white/35">Keep action independent.</span></h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/50">A deterministic operator surface for reviewing declared pages, commercial paths and evidence. No model call is required for this page to remain useful.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.025] px-5 py-4 text-[9px] uppercase tracking-[.18em] text-white/45">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
            Review loop active
          </div>
        </header>

        <section className="py-12">
          <div className="mb-6 flex items-end justify-between">
            <div><p className="text-[10px] uppercase tracking-[.3em] text-white/30">01 / declared surfaces</p><h2 className="mt-2 text-2xl font-light">Pages to inspect every cycle</h2></div>
            <span className="text-[9px] uppercase tracking-[.2em] text-white/25">{pages.length} surfaces</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map(([name, href, purpose], i) => (
              <a key={href} href={href} className="group rounded-2xl border border-white/10 bg-white/[.025] p-6 no-underline transition hover:-translate-y-0.5 hover:border-white/25">
                <div className="flex items-center justify-between"><span className="text-[9px] tracking-[.2em] text-white/25">0{i + 1}</span><span className="text-[9px] uppercase tracking-[.16em] text-white/25">OPEN ↗</span></div>
                <h3 className="mt-10 text-lg font-medium">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-white/40">{purpose}</p>
                <p className="mt-5 font-mono text-[10px] text-white/25">{href}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-12">
          <p className="text-[10px] uppercase tracking-[.3em] text-white/30">02 / autonomous operating loop</p>
          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {operatingLoop.map(([n, title, body]) => (
              <article key={title} className="bg-[#0b0c0b] p-6">
                <span className="font-mono text-[9px] text-white/25">{n}</span>
                <h3 className="mt-8 text-[11px] tracking-[.16em]">{title}</h3>
                <p className="mt-3 text-xs leading-5 text-white/35">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-12">
          <div className="grid gap-3 lg:grid-cols-3">
            <article className="rounded-2xl border border-white/10 p-6"><p className="text-[9px] tracking-[.2em] text-white/25">SOURCE</p><h3 className="mt-5 text-lg">GitHub</h3><p className="mt-2 text-sm text-white/40">Canonical implementation, workflows and audit evidence.</p></article>
            <article className="rounded-2xl border border-white/10 p-6"><p className="text-[9px] tracking-[.2em] text-white/25">DELIVERY</p><h3 className="mt-5 text-lg">Vercel</h3><p className="mt-2 text-sm text-white/40">Deployment state, runtime evidence and production delivery.</p></article>
            <article className="rounded-2xl border border-white/10 p-6"><p className="text-[9px] tracking-[.2em] text-white/25">REVENUE</p><h3 className="mt-5 text-lg">Model-optional</h3><p className="mt-2 text-sm text-white/40">Offer → checkout → fulfilment → record remains the durable path.</p></article>
          </div>
        </section>

        <footer className="border-t border-white/10 pt-7 text-[9px] uppercase tracking-[.25em] text-white/25">A11-K · Human-accountable · Evidence-gated · © 2026</footer>
      </div>
    </main>
  );
}
