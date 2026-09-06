# A11-K Brand + Release Registry

Canonical estate branding and release map. GitHub is source of truth; Vercel is delivery.

| Surface | Canonical brand | Role | Vercel state | Release state |
|---|---|---|---|---|
| A11-K | **A11-K — Flight Deck** | Private owner/operator control surface | `a11-k` linked to `Mind-Reply/A11-K` | READY deployment verified; production promotion requires verified deployment tooling |
| Sofia Tech Ledger | **The Sofia Tech Ledger / Софийски Технологичен Регистър** | Bilingual Bulgaria/Sofia SME intelligence product | Served from A11-K codebase | Content engine and health endpoint verified in source |
| ChatNeo | **ChatNeo** | Frozen chat application candidate | `chatneo` linked to archived `Mind-Reply/chatneo` | FROZEN; no active Vercel deployment |
| AlphaWin Color Advisor | **AlphaWin Color Advisor** | Standalone Vercel project | `alphawin-color-advisor` | SOURCE UNBOUND; release blocked until canonical source is identified |
| Accounting Asset Monitoring | **Accounting Asset Monitoring** | Standalone Vercel project | `accounting-asset-monitoring` | SOURCE UNBOUND; release blocked until canonical source is identified |

## Release gate

A release is only marked production when repository commit, build result, deployment ID, target environment and domain evidence are all recorded.

## Branding rule

Every public product gets one canonical product name, one owner, one source repository or explicitly documented source exception, one release identity and one evidence trail. No anonymous or duplicated product surfaces are promoted merely because a Vercel project exists.

## Current verified domains

- `a11-k.space` — existing/unavailable for new purchase; existing ownership/routing must be reconciled before mutation.
- `mind-reply.com` — existing/unavailable for new purchase; existing ownership/routing must be reconciled before mutation.
- `sofia-tech-ledger.com` — available for registration; purchase is intentionally not executed because the connected Vercel capability exposes availability/pricing but not domain purchase/registration.
