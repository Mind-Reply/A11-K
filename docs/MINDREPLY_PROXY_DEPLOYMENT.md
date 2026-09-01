# MindReply Gemini Proxy — Cloud Run Deployment

This deploys the fail-closed Gemini proxy (`src/server.js`) to Cloud Run so the
live MindReply copilot on `agents.html` can actually answer.

## Prerequisites (one-time)

1. **gcloud installed** (already done on this machine):
   ```powershell
   & "$env:USERPROFILE\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" --version
   ```

2. **Authenticate** (opens a browser — your Google account):
   ```powershell
   & "$env:USERPROFILE\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login
   ```

3. **Set your project**:
   ```powershell
   gcloud config set project YOUR_PROJECT_ID
   ```

## Credential path (choose one)

**Option A — Vertex AI (enterprise, ADC-based):**
- The Cloud Run service account needs the **Vertex AI User** role.
- `cloudbuild.yaml` already sets `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`,
  and `GOOGLE_GENAI_USE_ENTERPRISE=True`.

**Option B — API key (fallback):**
- Get a key from https://aistudio.google.com/apikey
- Set it as a Cloud Run secret or env var `GOOGLE_API_KEY`.

## Deploy

```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_SERVICE=mindreply-proxy,_REGION=europe-west1,_PROJECT=YOUR_PROJECT_ID
```

This builds the image, pushes it to Artifact Registry, and deploys to Cloud Run
with `--allow-unauthenticated` (public HTTPS endpoint).

## Verify

```bash
# Health
curl https://<service-url>/healthz

# Config status (never exposes credentials)
curl https://<service-url>/gemini
# -> {"ok":true,"configured":false,"mode":"none","models":[...]}

# Fail-closed POST (no credential -> 503)
curl -X POST https://<service-url>/gemini \
  -H "content-type: application/json" \
  -d '{"messages":[{"role":"user","content":"hi"}],"model":"gemini-2.5-flash"}'
# -> 503 AI_NOT_CONFIGURED
```

## Wire up the live copilot

Once the proxy is live, set the `data-proxy` attribute in `agents.html`:

```html
<div id="mindreply" data-proxy="https://<service-url>/gemini"></div>
```

Commit and push to `main`, then fast-forward `gh-pages` (same as before) so the
live site picks it up. The copilot will then show "Gemini connected" and accept
messages.

## Files

| File | Purpose |
|------|---------|
| `src/server.js` | HTTP server: `/healthz`, `/run`, `/gemini` (fail-closed) |
| `Dockerfile` | Node 20 image running `src/server.js` |
| `cloudbuild.yaml` | Cloud Build → build, push, deploy to Cloud Run |
| `service.yaml` | Cloud Run service definition (reference) |
| `.dockerignore` | Keeps the image lean |

## Security notes

- The Gemini credential is **server-side only** (env var / ADC). It is never
  returned to the browser.
- `/gemini` returns `503 AI_NOT_CONFIGURED` when no credential is set — it never
  pretends a model is live.
- Model IDs are allow-listed; payloads are validated.