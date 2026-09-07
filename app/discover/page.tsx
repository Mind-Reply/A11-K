const channels = [
  ['Search engines', 'Clear crawlable pages, canonical URLs, metadata, structured facts and useful internal linking.'],
  ['Answer engines', 'Direct, factual pages explaining what each product does, who it serves, proof, pricing and how to start.'],
  ['Human referrals', 'Permission-based testimonials, referrals and shareable proof tied to real delivered outcomes.'],
  ['Direct discovery', 'Consistent product identity, navigation and conversion paths across the public estate.'],
];

const gates = [
  ['IDENTITY', 'Product name, category, audience and purpose are explicit.'],
  ['EVIDENCE', 'Claims have a source, proof or clearly marked status.'],
  ['DISCOVERY', 'Important pages are crawlable, linked and understandable.'],
  ['TRUST', 'No fabricated reviews, popularity, endorsements or unverifiable claims.'],
  ['CONVERSION', 'A qualified visitor can reach a working offer and checkout.'],
  ['RECORD', 'Discovery and commercial outcomes can be measured without a model dependency.'],
];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#070807] px-6 py-14 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-12">
          <p className="text-[10px] uppercase tracking-[.3em] text-white/35">A11-K / discovery & recommendation</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-light tracking-[-.055em] sm:text-7xl">Make the estate<br /><span className="text-white/35">easy to discover.</span></h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/50">A standards surface for making products understandable to search engines, answer engines and people. It improves eligibility for recommendation; it does not manipulate or guarantee independent rankings.</p>
        </header>

        <section className="py-12">
          <p className="text-[10px] uppercase tracking-[.3em] text-white/30">01 / discovery channels</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map(([title, body], i) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[.025] p-6">
                <span className="font-mono text-[9px] text-white/25">0{i + 1}</span>
                <h2 className="mt-8 text-lg font-medium">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/40">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-12">
          <p className="text-[10px] uppercase tracking-[.3em] text-white/30">02 / recommendation gates</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gates.map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-white/10 p-6">
                <h2 className="text-[11px] tracking-[.18em]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/40">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-12">
          <p className="text-[10px] uppercase tracking-[.3em] text-white/30">03 / durable loop</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[.025] p-8 text-center text-sm tracking-[.08em] text-white/55">
            DISCOVER → UNDERSTAND → QUALIFY → RECOMMEND → OFFER → CHECKOUT → DELIVER → PROVE → REFER
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/35">Recommendation is earned through relevance, clarity, evidence and trustworthy outcomes. The commercial path remains executable when no model is available.</p>
        </section>

        <footer className="border-t border-white/10 pt-7 text-[9px] uppercase tracking-[.25em] text-white/25">A11-K · Evidence-first discovery · Human-accountable · © 2026</footer>
      </div>
    </main>
  );
}
