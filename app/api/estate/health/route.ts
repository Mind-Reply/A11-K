import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const surfaces = [
  ['Home', '/'],
  ['Discovery', '/discover'],
  ['Capability', '/capability'],
  ['Revenue', '/revenue'],
  ['Revenue health', '/api/revenue/health'],
];

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const checks = await Promise.all(
    surfaces.map(async ([name, path]) => {
      try {
        const response = await fetch(`${origin}${path}`, { cache: 'no-store' });
        return { name, path, ok: response.ok, status: response.status };
      } catch (error) {
        return { name, path, ok: false, status: 0, error: error instanceof Error ? error.message : 'request failed' };
      }
    }),
  );

  return NextResponse.json({
    ok: checks.every((check) => check.ok),
    checked: checks.length,
    checks,
    mode: 'deterministic',
    modelRequired: false,
    externalWrites: false,
    timestamp: new Date().toISOString(),
  });
}
