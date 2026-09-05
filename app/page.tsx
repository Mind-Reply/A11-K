import Link from 'next/link';

const metrics = [['SME SIGNALS','Live sector movement'],['EU FUNDING','Award intelligence'],['REGISTRY','Verified events']];

export default function Home() {
  return <main className="min-h-screen overflow-hidden bg-[#070807] text-white">
    <div className="gridlines" /><div className="glow glow-a" /><div className="glow glow-b" />
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
      <div><div className="text-sm font-semibold tracking-[.25em]">SOFIA TECH LEDGER</div><div className="mt-1 text-[9px] uppercase tracking-[.3em] text-white/30">Софийски Технологичен Регистър</div></div>
      <span className="badge"><i /> Daily intelligence</span>
    </nav>
    <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:py-28">
      <div><p className="eyebrow">Sofia · Bulgaria · EU</p><h1 className="mt-6 max-w-5xl text-6xl font-light leading-[.92] tracking-[-.065em] sm:text-8xl lg:text-[7.5rem]">See where<br /><span className="muted">the market moves.</span></h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-white/50 sm:text-xl">A bilingual intelligence layer tracking SME digitalisation, funding awards, registry events, NIS2 findings and sector gaps against the European benchmark.</p>
      <div className="mt-10 flex flex-wrap gap-3"><Link href="#signals" className="button">Explore the ledger <span>↗</span></Link><span className="micro">Daily · evidence-led · hash-chained</span></div></div>
      <div id="signals" className="signal-card"><div className="card-top"><span>01 / MARKET PULSE</span><span>SOFIA</span></div><div className="pulse"><div className="pulse-ring ring-1" /><div className="pulse-ring ring-2" /><div className="pulse-core"><span>STL</span><small>LIVE SIGNAL</small></div></div><div className="signal-label"><span className="live" /> monitoring active</div></div>
    </section>
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-10"><div className="grid border-t border-white/10 md:grid-cols-3">{metrics.map(([name,text],i)=><article className="metric" key={name}><span>0{i+1}</span><h2>{name}</h2><p>{text}</p></article>)}</div></section>
    <footer className="border-t border-white/10 px-6 py-7 text-[9px] uppercase tracking-[.28em] text-white/25 lg:px-10"><div className="mx-auto flex max-w-7xl justify-between"><span>A11-K · Mind-Reply</span><span>© 2026</span></div></footer>
  </main>;
}
