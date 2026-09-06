const capabilities = [
  ['INSPECT', 'Read the real repository state before acting.'],
  ['COMPOSE', 'Turn evidence into a concrete implementation, not a suggestion.'],
  ['VERIFY', 'Check source, deployment state, and runtime evidence separately.'],
  ['RECONCILE', 'Detect mismatches between source truth and delivery surfaces.'],
  ['ORCHESTRATE', 'Chain repository, deployment, design, content and automation work.'],
  ['RECORD', 'Leave an auditable trail of what changed and what remains unresolved.'],
];

export default function CapabilityProof() {
  return (
    <main className="min-h-screen bg-[#070807] px-6 py-16 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] uppercase tracking-[.3em] text-white/35">A11-K / capability proof</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-light tracking-[-.055em] sm:text-7xl">Not a promise.<br /><span className="text-white/35">A working execution loop.</span></h1>
        <p className="mt-7 max-w-2xl text-base leading-7 text-white/50">This surface records the operating pattern: inspect reality, change the source of truth, deliver through the connected platform, verify the result, and retain evidence.</p>
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(([title, body], i) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[.025] p-6">
              <span className="text-[9px] tracking-[.2em] text-white/25">0{i + 1}</span>
              <h2 className="mt-10 text-lg font-medium tracking-[-.02em]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/40">{body}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-white/10 p-6 font-mono text-xs text-white/45">
          <div>GITHUB  → source truth</div>
          <div>VERCEL  → delivery evidence</div>
          <div>STATUS  → verified / explicit / auditable</div>
        </div>
      </div>
    </main>
  );
}
