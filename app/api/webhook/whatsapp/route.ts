import { createHmac, timingSafeEqual } from 'node:crypto';
import { kv } from '@vercel/kv';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('hub.mode') === 'subscribe' && searchParams.get('hub.verify_token') === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(searchParams.get('hub.challenge') || '', { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

export async function POST(req: Request) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  const signature = req.headers.get('x-hub-signature-256');
  const raw = await req.text();
  if (!secret || !signature?.startsWith('sha256=')) return new Response('Forbidden', { status: 403 });
  const expected = createHmac('sha256', secret).update(raw).digest('hex');
  const a = Buffer.from(signature.slice(7));
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response('Forbidden', { status: 403 });

  const body = JSON.parse(raw);
  if (body.object === 'whatsapp_business_account') {
    for (const entry of body.entry ?? []) for (const change of entry.changes ?? []) {
      for (const msg of change.value?.messages ?? []) {
        const text = typeof msg.text?.body === 'string' ? msg.text.body.slice(0, 8000) : '';
        if (msg.from && text) await kv.lpush(`a11:wa:${msg.from}`, JSON.stringify({ id: msg.id, text, ts: Date.now() }));
      }
    }
  }
  return Response.json({ ok: true });
}
