# A11-K Estate Runtime Contract — 2026-09-13

Status: VERIFIED source inventory; deployment remains subject to live HTTP verification.

## Role
A11-K is the canonical A11-K / Sofia Tech Ledger product surface. It is not the MindReply public web root.

## Verified runtime surfaces
- Next.js application under `app/`.
- Operational/static surfaces including `Brushworks/`.
- `/api/health` exists in the Brushworks runtime and returns an explicit health response.
- Existing automation includes runtime gates, link health, leak guard, reality proof, repository stewardship, revenue determinism and Vercel production verification workflows.
- Data/runtime logic includes Eurostat, Bulgarian e-government discovery, TED procurement, NIS2 scanning, ledger verification and publication adapters.

## Delivery rule
GitHub is authoritative. Vercel is delivery/observability. No production routing, DNS, credentials or billing changes are authorized by this document.

## Required verification before promotion
1. Install dependencies from the committed lockfile.
2. Run tests and typecheck.
3. Run the production build.
4. Verify `/api/health`, public root, principal commercial routes, robots and sitemap.
5. Confirm deployment commit equals the GitHub commit being promoted.
6. Record evidence in the canonical reconstruction audit.
