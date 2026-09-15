import { kv } from '@vercel/kv';
import { ownerGuard, jsonError } from '@/lib/a11/guard';

export async function POST(req: Request) {
  const denied = ownerGuard(req);
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.botId !== 'string' || !/^[a-zA-Z0-9._-]{1,100}$/.test(body.botId)) {
    return jsonError('Invalid botId');
  }
  const safeConfig = {
    botId: body.botId,
    promo: typeof body.promo === 'string' ? body.promo.slice(0, 300) : undefined,
    updatedAt: new Date().toISOString(),
  };
  await kv.set(`config:live:${safeConfig.botId}`, safeConfig);
  await kv.publish('a11-config-update', JSON.stringify({ botId: safeConfig.botId, updatedAt: safeConfig.updatedAt }));
  return Response.json({ ok: true, updated: safeConfig.botId, propagated: true });
}
