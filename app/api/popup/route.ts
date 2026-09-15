import { kv } from '@vercel/kv';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = (searchParams.get('region') || 'global').slice(0, 40);
  const data = await kv.get<{ content?: string; href?: string }>(`popups:${region}`);
  return Response.json({
    ok: true,
    region,
    content: data?.content || null,
    href: data?.href || null,
  }, { headers: { 'cache-control': 'private, max-age=60' } });
}
