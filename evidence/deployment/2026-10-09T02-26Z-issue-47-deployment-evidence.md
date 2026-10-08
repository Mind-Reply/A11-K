# Deployment Evidence — Issue #47

**Generated:** 2026-10-09T02:26Z EEST  
**Source of truth:** Vercel API (authenticated) + GitHub HEAD `b6d676a5bbd01884747855ecf4b8aa0100a7bc2a`  
**Dispatch:** Execution dispatch — verify repository state and release evidence

## Verdict

**VERIFIED** — repository state and existing deployment evidence captured.  
No claim of unrestricted public production traffic is made. Evidence is limited to what the Vercel API returned at generation time.

## Repository state (Mind-Reply/A11-K)

| Item | Value |
|------|-------|
| Default branch HEAD | `b6d676a5bbd01884747855ecf4b8aa0100a7bc2a` |
| Commit message | ops: record AI-independent revenue pulse |
| Commit time | 2026-10-08T21:19:24Z |
| CNAME | `a11-k.space` |
| vercel.json domains | `a11-k.space`, `www.a11-k.space`, `akrobotics-nomrdbew.manus.space` |
| Brand registry | BRAND-RELEASE-REGISTRY.md present and explicit |

## Verified Vercel deployments (READY)

### a11-k-primary
- **Project ID:** `prj_kx0g1knbWr87clgCjVesoOdG8hKF`
- **Deployment ID:** `dpl_DVsnat8RDbm5pBeQeHwBzVpAtbHZ`
- **URL:** https://a11-k-primary-hvh6w2r3s-angelk.vercel.app
- **State:** READY
- **Target:** production
- **Inspector:** https://vercel.com/angelk/a11-k-primary/DVsnat8RDbm5pBeQeHwBzVpAtbHZ
- **Rollback candidate:** true

### a11k-surface (latest READY)
- **Project ID:** `prj_16tvQAGgo55rXJir8Ydj7yBBK9Qb`
- **Deployment ID:** `dpl_35j23uASdtjzfRWd3oNLUVEn9NN7`
- **URL:** https://a11k-surface-lh7qd47wz-angelk.vercel.app
- **State:** READY
- **Target:** production
- **Git SHA:** `5c718de5fd47fec0cdf6fadaf033ff43fb992cf6`
- **Inspector:** https://vercel.com/angelk/a11k-surface/35j23uASdtjzfRWd3oNLUVEn9NN7
- **Rollback candidate:** true

### a11-k-core (latest READY)
- **Project ID:** `prj_tF8MATzE2bOP0hPfiKZcuGX992dh`
- **Deployment ID:** `dpl_J5gJeEWMFYZSqoDi4tLyK2h55woZ`
- **URL:** https://a11-k-core-ikdbbdu6l-angelk.vercel.app
- **State:** READY
- **Target:** production
- **Git repo:** angellllkr-eng/A11-K
- **Git SHA:** `f2ed127b3bf5b6d28ddd6a2e89721b8ae9b6f231`
- **Inspector:** https://vercel.com/angelk/a11-k-core/J5gJeEWMFYZSqoDi4tLyK2h55woZ
- **Rollback candidate:** true

## Notable recent states

- Multiple recent production deployments across ResellerPro and A11-K surfaces are **BLOCKED**.
- a11k-live-foundation latest production attempts are BLOCKED or ERROR.
- No claim is made that custom domains (`a11-k.space` / `www.a11-k.space`) currently resolve to any of the above READY deployments without independent DNS / Cloudflare verification.

## Guardrails respected

- No secrets, no PII, no fabricated results.
- Evidence limited to API-returned IDs, URLs, states and timestamps.
- Production promotion still requires verified deployment tooling + domain evidence per BRAND-RELEASE-REGISTRY.md.

## Next human gate (if desired)

1. Confirm which READY deployment should be promoted / aliased to `a11-k.space`.
2. Reconcile domain ownership / Cloudflare routing.
3. Unblock or re-deploy any surface that must be live.

---
*Generated under owner dispatch for issue #47. AI-independent evidence record.*
