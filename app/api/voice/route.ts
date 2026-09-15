import { ownerGuard, jsonError } from '@/lib/a11/guard';

export async function GET(req: Request) {
  const denied = ownerGuard(req);
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text')?.trim() || '';
  const voiceId = searchParams.get('voiceId')?.trim() || process.env.A11_DEFAULT_VOICE_ID || '';
  if (!text || text.length > 5000 || !voiceId) return jsonError('Invalid voice request');
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return jsonError('Voice gateway is not configured', 503);
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
    signal: AbortSignal.timeout(30_000),
  }).catch(() => null);
  if (!response?.ok || !response.body) return jsonError('Voice provider unavailable', 502);
  return new Response(response.body, { headers: { 'content-type': 'audio/mpeg', 'cache-control': 'private, max-age=3600' } });
}
