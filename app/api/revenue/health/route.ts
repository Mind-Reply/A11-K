import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const checks = {
    stripeSecretConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    webhookSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    priceConfigured: Boolean(process.env.STRIPE_PRICE_ID),
  };

  const configured = Object.values(checks).every(Boolean);

  return NextResponse.json({
    ok: true,
    configured,
    checks,
    note: configured
      ? 'Stripe integration variables are present. Provider-side payout and account state still require external verification.'
      : 'Checkout can continue through the existing hosted payment link. API reconciliation is not activated until the required server-side Stripe variables are configured.',
    timestamp: new Date().toISOString(),
  });
}
