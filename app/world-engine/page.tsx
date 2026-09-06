import Link from 'next/link'

const systems = [
  ['INTELLIGENCE', 'Sofia Tech Ledger', 'signals · funding · registry'],
  ['PRODUCTS', 'Copilot + Proof View', 'planning · evidence · verification'],
  ['EVENTS', 'Launch Engine', 'content · schedule · campaign'],
  ['DELIVERY', 'GitHub → Vercel', 'source truth · deployment · runtime'],
]

const actions = [
  ['01', 'DISCOVER', 'inventory the estate and classify reality'],
  ['02', 'SIMULATE', 'preview affected products, content, domains and deployments'],
  ['03', 'BUILD', 'turn an approved objective into repository changes'],
  ['04', 'VERIFY', 'reconcile commit, deployment, route and evidence'],
  ['05', 'LEARN', 'record the result and feed the next release'],
]

export default function WorldEngine() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="gridlines" />
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '28px 22px 90px' }}>
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:20 }}>
          <div className="eyebrow">A11-K / WORLD ENGINE</div>
          <span className="badge"><i /> LIVE EXECUTION SURFACE</span>
        </header>

        <section style={{ padding: '100px 0 70px', maxWidth: 920 }}>
          <div className="eyebrow">CAPABILITY DEMONSTRATOR · 2026.09</div>
          <h1 style={{ fontSize:'clamp(48px,9vw,112px)', lineHeight:.88, letterSpacing:'-.07em', margin:'22px 0' }}>
            From intent<br />to <span style={{ opacity:.35 }}>reality.</span>
          </h1>
          <p style={{ maxWidth:690, color:'#ffffff70', fontSize:18, lineHeight:1.7 }}>
            A11-K treats repositories, products, content, events, deployments and evidence as one connected operating graph. The point is not to describe work. The point is to move it forward and prove what changed.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:30 }}>
            <Link href="/" className="button">RETURN TO FLIGHT DECK <span>↗</span></Link>
            <span className="micro">GitHub source truth · Vercel delivery · evidence gate</span>
          </div>
        </section>

        <section style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', border:'1px solid #ffffff10', borderRadius:28, overflow:'hidden', background:'#ffffff03' }}>
          {systems.map(([label, name, detail]) => (
            <div className="metric" key={label}>
              <span>{label}</span><h2>{name}</h2><p>{detail}</p>
            </div>
          ))}
        </section>

        <section style={{ marginTop:70, display:'grid', gridTemplateColumns:'minmax(280px, .8fr) minmax(0,1.2fr)', gap:28 }}>
          <div className="signal-card">
            <div className="card-top"><span>REALITY GRAPH</span><span><i className="live"/>CONNECTED</span></div>
            <div className="pulse">
              <div className="pulse-ring ring-1"/><div className="pulse-ring ring-2"/>
              <div className="pulse-core"><span>A11-K</span><small>CONTROL</small></div>
            </div>
            <div className="signal-label">SOURCE → CHANGE → DELIVERY → PROOF</div>
          </div>

          <div style={{ padding:'18px 4px' }}>
            <div className="eyebrow">EXECUTION LOOP</div>
            <div style={{ marginTop:20, borderTop:'1px solid #ffffff12' }}>
              {actions.map(([n, title, detail]) => (
                <div key={n} style={{ display:'grid', gridTemplateColumns:'42px 130px 1fr', gap:16, padding:'20px 0', borderBottom:'1px solid #ffffff12', alignItems:'baseline' }}>
                  <span style={{ color:'#ffffff25', fontSize:10 }}>{n}</span>
                  <strong style={{ fontSize:11, letterSpacing:'.18em' }}>{title}</strong>
                  <span style={{ color:'#ffffff48', fontSize:13 }}>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer style={{ marginTop:90, paddingTop:20, borderTop:'1px solid #ffffff10', display:'flex', justifyContent:'space-between', color:'#ffffff30', fontSize:10, letterSpacing:'.14em' }}>
          <span>A11-K · MIND-REPLY</span><span>HUMAN-ACCOUNTABLE · EVIDENCE-GATED</span>
        </footer>
      </div>
    </main>
  )
}
