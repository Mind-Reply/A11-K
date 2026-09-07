'use client';

import { useState } from 'react';

export default function RuntimeValidation({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<'idle' | 'running' | 'passed' | 'attention'>('idle');

  async function run() {
    setState('running');
    try {
      const response = await fetch('/api/estate/health', { cache: 'no-store' });
      const data = await response.json();
      setState(response.ok && data.ok ? 'passed' : 'attention');
    } catch {
      setState('attention');
    }
  }

  return (
    <div className={compact ? 'mt-5' : 'mt-8 rounded-2xl border border-white/10 bg-white/[.02] p-5'}>
      {!compact && <p className="text-xs uppercase tracking-[.2em] text-white/35">Executable proof</p>}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} disabled={state === 'running'} className="rounded-xl border border-white/15 px-4 py-3 text-xs uppercase tracking-widest disabled:opacity-50">
          {state === 'running' ? 'Checking…' : 'Run live checks →'}
        </button>
        {state !== 'idle' && <span className={state === 'passed' ? 'text-green-200' : state === 'attention' ? 'text-amber-200' : 'text-white/50'}>{state === 'passed' ? 'VALIDATION PASSED' : state === 'attention' ? 'REQUIRES ATTENTION' : 'CHECKING'}</span>}
      </div>
      {!compact && <p className="mt-3 text-xs leading-5 text-white/35">Deterministic runtime check. No model service, payment movement, DNS mutation, credential mutation or destructive action.</p>}
    </div>
  );
}
