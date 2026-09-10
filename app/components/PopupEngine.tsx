'use client';

import { useEffect, useState } from 'react';

export default function PopupEngine({ region }: { region: string }) {
  const [data, setData] = useState<{ content: string | null; href: string | null }>({ content: null, href: null });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 15_000);
    fetch(`/api/popup?region=${encodeURIComponent(region)}`, { credentials: 'same-origin' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setData({ content: d.content, href: d.href }))
      .catch(() => undefined);
    return () => window.clearTimeout(timer);
  }, [region]);

  if (!open || !data.content) return null;
  return (
    <aside role="dialog" aria-label="Site notice" className="fixed bottom-5 right-5 z-[9999] max-w-sm rounded-2xl border border-black/10 bg-white p-5 text-black shadow-2xl">
      <div className="flex items-start justify-between gap-5">
        <p className="whitespace-pre-line text-sm leading-6">{data.content}</p>
        <button aria-label="Close" onClick={() => setOpen(false)} className="text-xs opacity-50 hover:opacity-100">×</button>
      </div>
      {data.href && <a href={data.href} rel="noopener noreferrer" className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-xs font-medium text-white">Open</a>}
    </aside>
  );
}
