# The Sofia Tech Ledger / Софийски Технологичен Регистър

Daily bilingual monitor of Sofia SME digitalization, EU grant awards, registry events, NIS2 findings, and sector gaps vs the EU average.

## Run

```powershell
cd C:\Users\ANGEL\GitHubSync\sofia-tech-ledger
node --test tests/
node src/index.js --as-of=2026-08-21
```

Artifacts land in `out/`:

- HTML bulletin
- SVG intensity chart
- social copy
- JSON report
- SHA-256 hash-chained ledger

Ghost stays skipped until `GHOST_ADMIN_URL` and `GHOST_ADMIN_API_KEY` are set. Publish mode defaults to `draft`.

## Cloud target

Google Cloud project **MIND REPLY** / `mind-reply-496111`. See `docs/GCP_MIND_REPLY.md`. No cloud resources have been created.
