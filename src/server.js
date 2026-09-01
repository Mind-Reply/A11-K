// Minimal HTTP server for Cloud Run — runs the ledger pipeline on demand
// and serves the MindReply Gemini proxy (server-side credentials only).
//
// Ledger:
//   GET /healthz  -> liveness
//   GET /run?as_of=YYYY-MM-DD&live=1 -> executes the pipeline and returns the report summary
//
// MindReply Gemini proxy (fail-closed):
//   GET  /gemini  -> configuration status + model catalogue (never credentials)
//   POST /gemini  -> { messages, model, systemPrompt } -> { content }
//   Returns 503 AI_NOT_CONFIGURED when no credential is configured.
//
// Two supported credential paths (never exposed to the browser):
//   1. API key (fallback): GOOGLE_API_KEY -> generativelanguage.googleapis.com
//   2. Enterprise / Vertex AI: ADC + GOOGLE_CLOUD_PROJECT + GOOGLE_CLOUD_LOCATION
//      -> {location}-aiplatform.googleapis.com (uses GOOGLE_GENAI_USE_ENTERPRISE)

import { createServer } from 'node:http';
import { run } from './index.js';

const PORT = Number(process.env.PORT ?? 8080);

// Allow-listed Gemini models. Anything else is rejected.
const ALLOWED_MODELS = new Set([
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.5-flash-thinking',
  'gemini-live-2.5-flash',
]);

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const VERTEX_API_BASE = 'https://aiplatform.googleapis.com/v1';

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error('payload-too-large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
  });
  res.end(payload);
}

// Convert MindReply messages [{role, content}] into Gemini contents.
// Roles: user -> user, model -> model. Anything else is dropped.
function toGeminiContents(messages) {
  const contents = [];
  for (const m of messages || []) {
    const role = m.role === 'model' ? 'model' : 'user';
    const text = typeof m.content === 'string' ? m.content.trim() : '';
    if (!text) continue;
    contents.push({ role, parts: [{ text }] });
  }
  return contents;
}

// Resolve an OAuth2 access token from Application Default Credentials.
// Returns null when ADC is not available (so the caller can fail closed).
async function adcAccessToken() {
  try {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const execFileAsync = promisify(execFile);
    const { stdout } = await execFileAsync('gcloud', [
      'auth', 'application-default', 'print-access-token',
    ], { timeout: 15000 });
    const token = String(stdout || '').trim();
    return token || null;
  } catch {
    return null;
  }
}

// Detect which credential path is available.
// Returns 'api-key' | 'vertex' | null.
async function detectCredentialPath() {
  if (process.env.GOOGLE_API_KEY) return 'api-key';
  if (process.env.GOOGLE_CLOUD_PROJECT && process.env.GOOGLE_CLOUD_LOCATION) {
    const token = await adcAccessToken();
    if (token) return 'vertex';
  }
  return null;
}

// Call Gemini via the public API key endpoint (fallback path).
async function callGeminiApiKey(model, requestBody, apiKey) {
  const upstream = await fetch(
    `${GEMINI_API_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(requestBody),
    }
  );
  if (!upstream.ok) {
    const errText = await upstream.text();
    throw new Error(`upstream-error: ${errText.slice(0, 500)}`);
  }
  return upstream.json();
}

// Call Gemini via Vertex AI (enterprise path) using ADC.
async function callGeminiVertex(model, requestBody) {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'global';
  const token = await adcAccessToken();
  if (!token) throw new Error('adc-unavailable');

  const endpoint =
    location === 'global'
      ? `${VERTEX_API_BASE}/projects/${project}/locations/global/publishers/google/models/${encodeURIComponent(model)}:generateContent`
      : `${VERTEX_API_BASE}/projects/${project}/locations/${location}/publishers/google/models/${encodeURIComponent(model)}:generateContent`;

  const upstream = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });
  if (!upstream.ok) {
    const errText = await upstream.text();
    throw new Error(`upstream-error: ${errText.slice(0, 500)}`);
  }
  return upstream.json();
}

async function handleGemini(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const hasVertex = Boolean(
    process.env.GOOGLE_CLOUD_PROJECT && process.env.GOOGLE_CLOUD_LOCATION
  );

  // GET: expose status + catalogue, never credentials.
  if (req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      configured: Boolean(apiKey) || hasVertex,
      mode: apiKey ? 'api-key' : hasVertex ? 'vertex' : 'none',
      models: [...ALLOWED_MODELS],
    });
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'method-not-allowed' });
  }

  // Fail closed: no credential configured -> refuse to answer.
  const path = await detectCredentialPath();
  if (!path) {
    return json(res, 503, { ok: false, error: 'AI_NOT_CONFIGURED' });
  }

  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    return json(res, 400, { ok: false, error: 'invalid-json' });
  }

  const model = body.model;
  if (!ALLOWED_MODELS.has(model)) {
    return json(res, 400, { ok: false, error: 'model-not-allowed' });
  }

  const contents = toGeminiContents(body.messages);
  if (contents.length === 0) {
    return json(res, 400, { ok: false, error: 'no-messages' });
  }

  const systemPrompt =
    typeof body.systemPrompt === 'string' && body.systemPrompt.trim()
      ? body.systemPrompt.trim()
      : undefined;

  const requestBody = {
    contents,
    ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
  };

  try {
    const data =
      path === 'api-key'
        ? await callGeminiApiKey(model, requestBody, apiKey)
        : await callGeminiVertex(model, requestBody);

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p) => (typeof p.text === 'string' ? p.text : ''))
      .join('')
      .trim();

    if (!text) {
      return json(res, 502, { ok: false, error: 'empty-response' });
    }

    return json(res, 200, { ok: true, content: text });
  } catch (err) {
    return json(res, 502, { ok: false, error: 'upstream-unreachable', detail: String(err.message || err) });
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname === '/healthz') {
      return json(res, 200, { ok: true, service: 'sofia-tech-ledger' });
    }
    if (url.pathname === '/run') {
      if (url.searchParams.get('live') === '1') process.env.STL_LIVE = '1';
      const asOf = url.searchParams.get('as_of') ?? undefined;
      const { report, files, ledger, publish } = await run({ asOf });
      return json(res, 200, {
        ok: true,
        asOf: report.asOf,
        readiness: report.readiness,
        live: { eurostat: report.liveEurostat, egov: report.liveEgov, ted: report.liveTed },
        ledger, publish, files
      });
    }
    if (url.pathname === '/gemini') {
      return handleGemini(req, res);
    }
    return json(res, 404, { ok: false, error: 'not-found' });
  } catch (err) {
    return json(res, 500, { ok: false, error: String(err.message || err) });
  }
});

server.listen(PORT, () => console.log(`sofia-tech-ledger listening on :${PORT}`));