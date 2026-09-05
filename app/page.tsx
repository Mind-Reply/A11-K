import Link from 'next/link';

const metrics = [['SME SIGNALS','Live sector movement'],['EU FUNDING','Award intelligence'],['REGISTRY','Verified events']];
const products = [
  ['Sofia Tech Ledger','Bilingual regional intelligence for Sofia and Bulgaria.','/sofia-tech-ledger'],
  ['A11-K Copilot','A public workspace for structured planning, review and evidence.','/copilot.html'],
  ['Proof View','Separate verified evidence from emerging signals before action.','/a11-sites.html'],
];

export default function Home() {
  return <main className="min-h-screen overflow-hidden bg-[#070807] text-white">
    <div className="gridlines" /><div className="glow glow-a" /><div className="glow glow-b" />
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
      <Link href="/" className="no-underline"><div className="text-sm font-semibold tracking-[.25em]">A11-K</div><div className="mt-1 text-[9px] uppercase tracking-[.3em] text-white/30">Mind-Reply · Purpose Multiverse</div></Link>
      <div className="flex items-center gap-5"><Link href="#products" className="hidden text-[9px] uppercase tracking-[.18em] text-white/35 transition hover:text-white md:block">Surfaces</Link><span className="badge"><i /> Daily intelligence</span></div>
    </nav>
    <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:py-28">
      <div><p className="eyebrow">Sofia · Bulgaria · EU</p><h1 className="mt-6 max-w-5xl text-6xl font-light leading-[.92] tracking-[-.065em] sm:text-8xl lg:text-[7.5rem]">See where<br /><span className="muted">the market moves.</span></h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-white/50 sm:text-xl">A bilingual evidence-first intelligence surface for SME digitalisation, funding awards, registry events, procurement and technology signals — designed to turn noise into a clearer next decision.</p>
      <div className="mt-10 flex flex-wrap gap-3"><Link href="/sofia-tech-ledger" className="button">Explore the ledger <span>↗</span></Link><Link href="/copilot.html" className="rounded-[14px] border border-white/15 px-[18px] py-4 text-[13px] text-white transition hover:-translate-y-0.5 hover:border-white/30">Open A11-K Copilot</Link></div></div>
      <div id="signals" className="signal-card"><div className="card-top"><span>01 / MARKET PULSE</span><span>SOFIA</span></div><div className="pulse"><div className="pulse-ring ring-1" /><div className="pulse-ring ring-2" /><div className="pulse-core"><span>STL</span><small>LIVE SIGNAL</small></div></div><div className="signal-label"><span className="live" /> monitoring active · evidence gated</div></div>
    </section>
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 lg:px-10"><div className="grid border-t border-white/10 md:grid-cols-3">{metrics.map(([name,text],i)=><article className="metric" key={name}><span>0{i+1}</span><h2>{name}</h2><p>{text}</p></article>)}</div></section>
    <section id="products" className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-10"><div className="mb-8 flex items-end justify-between gap-5"><div><p className="eyebrow">A11-K / SURFACES</p><h2 className="mt-3 text-3xl font-light tracking-[-.04em] sm:text-5xl">Built to move from signal to action.</h2></div><span className="hidden text-[9px] uppercase tracking-[.2em] text-white/25 sm:block">03 / 03</span></div><div className="grid gap-3 md:grid-cols-3">{products.map(([name,body,href],i)=><Link key={href} href={href} className="group rounded-2xl border border-white/10 bg-white/[.025] p-7 no-underline transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[.05]"><span className="text-[9px] tracking-[.2em] text-white/25">0{i+1}</span><h3 className="mt-14 text-xl font-medium tracking-[-.02em]">{name}</h3><p className="mt-3 text-sm leading-6 text-white/40">{body}</p><span className="mt-7 inline-block text-[10px] uppercase tracking-[.16em] text-white/45 transition group-hover:text-white">Open surface ↗</span></Link>)}</div></section>
    <footer className="border-t border-white/10 px-6 py-7 text-[9px] uppercase tracking-[.28em] text-white/25 lg:px-10"><div className="mx-auto flex max-w-7xl justify-between"><span>A11-K · Mind-Reply</span><span>© 2026 · Evidence-gated · Human-accountable</span></div></footer>
  </main>;
}
