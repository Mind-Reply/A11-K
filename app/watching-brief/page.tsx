const units = [
  ['1', '13,687 sq ft', 'Available'],
  ['2', '13,480 sq ft', 'Available'],
  ['3', '13,538 sq ft', 'Available'],
  ['4', '22,655 sq ft', 'Available'],
  ['5', '12,808 sq ft', 'Available'],
  ['6', '21,531 sq ft', 'Available'],
  ['7', '16,756 sq ft', 'Available'],
];

export const metadata = {
  title: 'Industrial Estate Watching Brief · 9 September 2026 | A11-K',
  description: 'Watching brief for Knight Frank LIC012534565. Units 1–7 remain available to pre-let; public completion and power-upgrade terms remain unconfirmed.',
};

export default function WatchingBrief() {
  return (
    <main className="min-h-screen bg-[#070807] px-6 py-12 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-white/10 pb-10">
          <p className="text-[10px] uppercase tracking-[.25em] text-white/40">A11-K · Watching brief only</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-light tracking-[-.04em] sm:text-6xl">Industrial estate availability — 9 September 2026</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/50">Ref: Knight Frank LIC012534565 · A11K-IND-W37-2026-09-09</p>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-white/50">Public-source watching brief. No occupational interest, offer, pre-let or letting is implied.</p>
        </header>

        <section className="py-10">
          <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.2em] text-white/35">01 / Units</p><h2 className="mt-2 text-2xl font-light">Units 1–7</h2></div><span className="rounded-full border border-white/10 px-3 py-1 text-[9px] uppercase tracking-[.15em] text-white/45">7 / 7 available</span></div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm"><thead className="bg-white/[.035] text-[9px] uppercase tracking-[.18em] text-white/35"><tr><th className="px-5 py-4">Unit</th><th className="px-5 py-4">Approx. size</th><th className="px-5 py-4">Status</th></tr></thead><tbody>{units.map(([unit, size, status]) => <tr key={unit} className="border-t border-white/10"><td className="px-5 py-4 text-white/75">{unit}</td><td className="px-5 py-4 text-white/55">{size}</td><td className="px-5 py-4"><span className="text-white/70">{status}</span></td></tr>)}</tbody></table>
          </div>
          <p className="mt-4 text-xs leading-6 text-white/40">Primary agent marketing continues to show all seven units as Available / available to pre-let. No public “Under offer”, “Pre-let”, or “Let” flag is asserted here.</p>
        </section>

        <section className="grid gap-4 border-t border-white/10 py-10 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[.025] p-7"><p className="text-[10px] uppercase tracking-[.2em] text-white/35">02 / Programme</p><h2 className="mt-3 text-2xl font-light">Completion date</h2><p className="mt-4 text-sm leading-7 text-white/50">No contracted practical completion date is published. Brochure v8 states “Available Q1 2026”, while current Rightmove / Zoopla listings state lease availability from 1 December 2026. SEGRO continues to describe the scheme as available to pre-let, with construction ready to commence immediately and a contractor appointed.</p></article>
          <article className="rounded-2xl border border-white/10 bg-white/[.025] p-7"><p className="text-[10px] uppercase tracking-[.2em] text-white/35">03 / Power</p><h2 className="mt-3 text-2xl font-light">2 MVA base · up to 5 MVA potential</h2><p className="mt-4 text-sm leading-7 text-white/50">Estate base provision is a share of 2 MVA, with an upgrade path described as potential / available up to 5 MVA. Public marketing does not disclose upgrade cost allocation or lead time; those commercial and programme terms require direct confirmation from SEGRO or the joint agents.</p></article>
        </section>

        <section className="border-t border-white/10 py-10"><p className="text-[10px] uppercase tracking-[.2em] text-white/35">04 / Bottom line</p><div className="mt-4 rounded-2xl border border-white/10 bg-white/[.025] p-7"><p className="text-lg leading-8 text-white/75">All units remain marketed as available to pre-let. Public marketing dates are inconsistent: portal availability is 1 December 2026, the older brochure says Q1 2026, and SEGRO does not publish a fixed PC date. Power is marketed at a 2 MVA share with potential up to 5 MVA; upgrade commercial terms remain unconfirmed.</p></div></section>

        <footer className="border-t border-white/10 py-7 text-[9px] uppercase tracking-[.2em] text-white/25">A11-K · Evidence-led public record · Watching brief only · 9 September 2026</footer>
      </div>
    </main>
  );
}
