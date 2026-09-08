import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const startedAt = Date.now();
  const checks: Record<string, unknown> = {};

  try {
    const estate = await fetch(`${origin}/api/estate/health`, { cache: 'no-store' });
    checks.estate = await estate.json();

    const revenue = await fetch(`${origin}/api/revenue/health`, { cache: 'no-store' });
    checks.revenue = await revenue.json();

    return NextResponse.json({
      ok: estate.ok && revenue.ok,
      action: 'bounded-validation',
      autonomous: true,
      modelRequired: false,
      externalWrites: false,
      consequentialActions: 'owner-gated',
      durationMs: Date.now() - startedAt,
      checks,
      evidence: {
        type: 'runtime-validation',
        generatedAt: new Date().toISOString(),
        source: 'A11-K production runtime',
      },
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      action: 'bounded-validation',
      autonomous: true,
      modelRequired: false,
      externalWrites: false,
      error: error instanceof Error ? error.message : 'validation failed',
      durationMs: Date.now() - startedAt,
    }, { status: 503 });
  }
}
