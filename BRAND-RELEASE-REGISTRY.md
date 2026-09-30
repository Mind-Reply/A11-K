# A11-K Brand + Release Registry

Canonical estate branding and release map. GitHub is source of truth; Cloudflare / ResellerPro are the intended delivery and execution platforms.

| Surface | Canonical brand | Role | Delivery state | Release state |
|---|---|---|---|---|
| A11-K | **A11-K — Flight Deck** | Private owner/operator control surface | Cloudflare / ResellerPro delivery path | READY deployment verified; production promotion requires verified deployment tooling |
| Sofia Tech Ledger | **The Sofia Tech Ledger / Софийски Технологичен Регистър** | Bilingual Bulgaria/Sofia SME intelligence product | Served from A11-K codebase | Content engine and health endpoint verified in source |
| ChatNeo | **ChatNeo** | Frozen chat application candidate | Historical delivery only | FROZEN; no active release |
| AlphaWin Color Advisor | **AlphaWin Color Advisor** | Standalone product surface | SOURCE UNBOUND | Release blocked until canonical source is identified |
| Accounting Asset Monitoring | **Accounting Asset Monitoring** | Standalone product surface | SOURCE UNBOUND | Release blocked until canonical source is identified |

## Release gate

A release is only marked production when repository commit, build result, deployment ID, target environment and domain evidence are all recorded.

## Branding rule

Every public product gets one canonical product name, one owner, one source repository or explicitly documented source exception, one release identity and one evidence trail. No anonymous or duplicated product surfaces are promoted merely because a delivery project exists.

## Current verified domains

- `a11-k.space` — existing/unavailable for new purchase; existing ownership/routing must be reconciled before mutation.
- `mind-reply.com` — existing/unavailable for new purchase; existing ownership/routing must be reconciled before mutation.
- `sofia-tech-ledger.com` — availability and purchase status must be independently verified before any registration action.

## Platform rule

Do not describe a deployment as live from repository configuration alone. Cloudflare / ResellerPro delivery evidence must identify the exact deployment or immutable artifact and target environment.
