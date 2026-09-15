import { createHash, timingSafeEqual } from 'node:crypto';

export function ownerGuard(request: Request): Response | null {
  const expected = process.env.A11_OWNER_ACTION_TOKEN;
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!expected || !supplied) return new Response('Unauthorized', { status: 401 });
  const a = createHash('sha256').update(supplied).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b) ? null : new Response('Unauthorized', { status: 401 });
}

export function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}
