# GCP target — MIND REPLY

Verified from the live console screenshot on 22 Aug 2026.

- Project name: MIND REPLY
- Project ID: `mind-reply-496111`
- Project number: `768983523738`
- Console: https://console.cloud.google.com/welcome?project=mind-reply-496111
- Preferred region: `europe-west3` (Frankfurt) for EU data residency

## Bound, not provisioned

This repo is wired to that project as the cloud target. Nothing below has been created yet:

- no Gemini API key
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
