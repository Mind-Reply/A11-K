# GCP target — MIND REPLY

Verified from live console screenshots on 22 Aug 2026.

- Project name: MIND REPLY
- Project ID: `mind-reply-496111`
- Project number: `768983523738`
- Console: https://console.cloud.google.com/welcome?project=mind-reply-496111
- Preferred region: `europe-west3` (Frankfurt) for EU data residency

## IAM (screenshot 022014 / 022106)

| Principal | Label | Role seen |
| --- | --- | --- |
| `mind.repl@gmail.com` | Angel Krastev | Owner |
| `mind-reply@mind-reply-496111.iam.gserviceaccount.com` | mind-reply | Access Context Manager Admin (+ keys) |
| `mindreply@mind-reply-496111.iam.gserviceaccount.com` | mindreply | Access Approval Admin · no keys |
| `services@mind-reply-496111.iam.gserviceaccount.com` | mind-reply.netlify.app | Owner · no keys |
| `angellllkrustev@gmail.com` | Gal | App Hub / Application Design Center / Cloud Hub Operator |
| `notifications@datingpositives.com` | (blank) | Access Context Manager Admin |
| Google-managed service agents | API Hub, Gemini, Dataform, Eventarc, Pub/Sub, ML Engine | default service agents |

## Service-account keys (screenshots 014941 + 015447)

Account `mind-reply@mind-reply-496111.iam.gserviceaccount.com` has **two active keys**, both created 12 May 2026, expiry shown as 1 Jan 10000:

- `ab6f272ca475c83df1ee36371ad45b0f117ea1f8`
- `2febf280c12797497dd40722efb2c19518dc1347`

Those IDs were **not** found in indexed source files. Do not download, print, or commit private key JSON. Prefer Workload Identity later.

## Bound, not provisioned

This repo is wired to that project as the cloud target. Welcome-card actions have **not** been clicked. Still not created:

- no Gemini API key from the welcome card
- no Vertex agent
- no VM
- no BigQuery job
- no Cloud Storage bucket
- no Cloud Run / Cloud Functions deploy

## Next authorized cloud steps

1. Enable only: Cloud Functions, Cloud Scheduler, Cloud Storage, Vertex AI.
2. Create bucket `sofia-tech-ledger-artifacts` in `europe-west3`.
3. Deploy `scripts/gcp-function.js` as a Cloud Function, 06:30 Europe/Sofia.
4. Keep `PUBLISH_MODE=draft` until Ghost credentials exist.

Do not click “Create Gemini API key”, “Create a VM”, or “Create a storage bucket” from the welcome cards until those steps are explicitly approved.
