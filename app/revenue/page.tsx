const liveOffer = {
  name: 'NIS2 Gap Audit — 48h',
  price: '€490',
  cadence: 'one-time',
  checkout: 'https://buy.stripe.com/00w9ANbQYfgkcyk3Gq63K07',
};

const flow = [
  ['OFFER', 'Published commercial offer'],
  ['CHECKOUT', 'Stripe-hosted payment page'],
  ['PAYMENT', 'Stripe confirms the customer payment'],
  ['SETTLEMENT', 'Stripe makes the balance available for payout'],
  ['PAYOUT', 'Stripe transfers settled funds to the configured bank account'],
  ['RECONCILIATION', 'A11-K records verified payment evidence'],
];

export default function RevenuePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#07080d', color: '#f5f7fb', padding: '32px 20px', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
      <section style={{ maxWidth: 980, margin: '0 auto' }}>
        <p style={{ color: '#9b8cff', letterSpacing: '.16em', textTransform: 'uppercase', fontSize: 11 }}>A11-K / Revenue Control</p>
        <h1 style={{ fontSize: 'clamp(36px, 7vw, 64px)', letterSpacing: '-.05em', margin: '10px 0' }}>Money path</h1>
        <p style={{ color: '#9da6b8', maxWidth: 720, fontSize: 17 }}>
          The commercial path is designed so payment and payout do not depend on a model being available. Stripe handles the payment and payout rails; A11-K provides the operational evidence and control surface.
        </p>

        <div style={{ marginTop: 28, padding: 24, border: '1px solid rgba(255,255,255,.12)', borderRadius: 18, background: '#12141e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#34d399', fontSize: 11, fontWeight: 800, letterSpacing: '.1em' }}>LIVE CHECKOUT PATH</div>
              <h2 style={{ margin: '8px 0 4px' }}>{liveOffer.name}</h2>
              <div style={{ fontSize: 30, fontWeight: 800 }}>{liveOffer.price} <span style={{ color: '#9da6b8', fontSize: 14, fontWeight: 400 }}>/ {liveOffer.cadence}</span></div>
            </div>
            <a href={liveOffer.checkout} style={{ alignSelf: 'center', padding: '14px 20px', borderRadius: 12, background: '#f4f2ff', color: '#111', fontWeight: 800, textDecoration: 'none' }}>Open checkout →</a>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
          {flow.map(([stage, detail], index) => (
            <div key={stage} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 16, padding: '16px 18px', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, background: 'rgba(255,255,255,.025)' }}>
              <strong style={{ fontSize: 12, letterSpacing: '.1em' }}>{String(index + 1).padStart(2, '0')} · {stage}</strong>
              <span style={{ color: '#b5bdcc' }}>{detail}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, padding: 20, border: '1px solid rgba(251,191,36,.28)', borderRadius: 14, background: 'rgba(251,191,36,.06)', color: '#fbbf24', fontSize: 14 }}>
          <strong>Important:</strong> the checkout is a live payment path, but this application does not claim that a payout has occurred. Actual bank payout timing is controlled by the Stripe account payout schedule and settlement state. The bank account and payout configuration must be verified in Stripe before treating cash receipt as proven.
        </div>

        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
          <Status title="Revenue dependency" value="Model-independent" />
          <Status title="Checkout" value="Live link present" />
          <Status title="Payout" value="External Stripe state" />
          <Status title="Reconciliation" value="Control-plane target" />
        </div>

        <p style={{ marginTop: 36, color: '#737c8d', fontSize: 12 }}>A11-K · Human-accountable · Evidence-gated · © 2026</p>
      </section>
    </main>
  );
}

function Status({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ padding: 18, border: '1px solid rgba(255,255,255,.08)', borderRadius: 14 }}>
      <div style={{ color: '#737c8d', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em' }}>{title}</div>
      <div style={{ marginTop: 6, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
