'use client';

import { useEffect, useState } from 'react';

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

const dark = {
  page: 'bg-[#070807] text-white', border: 'border-white/10', muted: 'text-white/50', faint: 'text-white/35',
  card: 'border-white/10 bg-white/[.025]', loop: 'border-white/10 bg-white/[.025] text-white/55',
};

const bright = {
  page: 'bg-[#f5f7f4] text-[#101410]', border: 'border-black/10', muted: 'text-black/60', faint: 'text-black/45',
  card: 'border-black/10 bg-white shadow-sm', loop: 'border-black/10 bg-white text-black/65',
};

export default function DiscoverPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem('a11k-discover-theme');
    if (saved === 'bright') setIsDark(false);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    window.localStorage.setItem('a11k-discover-theme', next ? 'dark' : 'bright');
  }

  const theme = isDark ? dark : bright;

  return (
    <main className={`min-h-screen px-5 py-8 transition-colors duration-300 motion-reduce:transition-none sm:px-10 sm:py-14 lg:px-16 ${theme.page}`}>
      <div className="mx-auto max-w-7xl">
        <header className={`border-b pb-10 sm:pb-12 ${theme.border}`}>
          <div className="flex items-start justify-between gap-6">
            <p className={`pt-2 text-[10px] uppercase tracking-[.3em] ${theme.faint}`}>A11-K / discovery & recommendation</p>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'bright' : 'dark'} mode`}
              aria-pressed={!isDark}
              className={`shrink-0 rounded-full border px-3 py-2 text-[9px] font-medium uppercase tracking-[.16em] transition-colors hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-current motion-reduce:transition-none ${theme.border}`}
            >
              {isDark ? '☀ Bright' : '◐ Dark'}
            </button>
          </div>
          <h1 className="mt-5 max-w-5xl text-5xl font-light tracking-[-.055em] sm:text-7xl">Make the estate<br /><span className={theme.faint}>easy to discover.</span></h1>
          <p className={`mt-6 max-w-2xl text-sm leading-7 ${theme.muted}`}>A standards surface for making products understandable to search engines, answer engines and people. It improves eligibility for recommendation; it does not manipulate or guarantee independent rankings.</p>
        </header>

        <section className="py-12">
          <p className={`text-[10px] uppercase tracking-[.3em] ${theme.faint}`}>01 / discovery channels</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map(([title, body], i) => (
              <article key={title} className={`rounded-2xl border p-6 transition-colors duration-300 motion-reduce:transition-none ${theme.card}`}>
                <span className={`font-mono text-[9px] ${theme.faint}`}>0{i + 1}</span>
                <h2 className="mt-8 text-lg font-medium">{title}</h2>
                <p className={`mt-3 text-sm leading-6 ${theme.muted}`}>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`border-t py-12 ${theme.border}`}>
          <p className={`text-[10px] uppercase tracking-[.3em] ${theme.faint}`}>02 / recommendation gates</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gates.map(([title, body]) => (
              <article key={title} className={`rounded-2xl border p-6 ${theme.border}`}>
                <h2 className="text-[11px] tracking-[.18em]">{title}</h2>
                <p className={`mt-3 text-sm leading-6 ${theme.muted}`}>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`border-t py-12 ${theme.border}`}>
          <p className={`text-[10px] uppercase tracking-[.3em] ${theme.faint}`}>03 / durable loop</p>
          <div className={`mt-6 rounded-2xl border p-6 text-center text-xs leading-6 tracking-[.06em] sm:p-8 sm:text-sm sm:tracking-[.08em] ${theme.loop}`}>
            DISCOVER → UNDERSTAND → QUALIFY → RECOMMEND → OFFER → CHECKOUT → DELIVER → PROVE → REFER
          </div>
          <p className={`mt-5 max-w-3xl text-sm leading-7 ${theme.faint}`}>Recommendation is earned through relevance, clarity, evidence and trustworthy outcomes. The commercial path remains executable when no model is available.</p>
        </section>

        <footer className={`border-t pt-7 text-[9px] uppercase tracking-[.25em] ${theme.border} ${theme.faint}`}>A11-K · Evidence-first discovery · Human-accountable · © 2026</footer>
      </div>
    </main>
  );
}
