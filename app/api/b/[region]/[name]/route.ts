import { kv } from '@vercel/kv';
import { ownerGuard, jsonError } from '@/lib/a11/guard';

export async function POST(req: Request, { params }: { params: Promise<{ region: string; name: string }> }) {
  const denied = ownerGuard(req);
  if (denied) return denied;
  const { region, name } = await params;
  const body = await req.json().catch(() => null);
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > 8000) return jsonError('message must be 1–8000 characters');

  const modelUrl = process.env.A11_MODEL_API_URL;
  const modelKey = process.env.A11_MODEL_API_KEY;
  if (!modelUrl || !modelKey) return jsonError('Model gateway is not configured', 503);

  const requestId = crypto.randomUUID();
  await kv.set(`a11:request:${requestId}`, { region, name, createdAt: new Date().toISOString() }, { ex: 3600 });

  const upstream = await fetch(modelUrl, {
    method: 'POST',
    headers: { authorization: `Bearer ${modelKey}`, 'content-type': 'application/json', 'x-a11-request-id': requestId },
    body: JSON.stringify({ message, agent: name, region, requestId }),
    signal: AbortSignal.timeout(30_000),
  }).catch(() => null);

  if (!upstream?.ok) return jsonError('Model gateway unavailable', 502);
  const result = await upstream.json();
  return Response.json({ ok: true, requestId, result });
}
