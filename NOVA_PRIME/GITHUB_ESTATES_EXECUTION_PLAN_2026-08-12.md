# NOVA PRIME — GitHub Estate Execution Plan

**Owner:** Angel K / A11-K / Mind-Reply  
**Audit date:** 2026-08-12  
**Purpose:** turn the current GitHub estate into one controlled, verifiable execution system without destructive cleanup.

## 1. What was verified

### Organizations / ownership surfaces
- `Mind-Reply` is accessible and contains the main product, control-plane, automation, brand, Aurel, MCP, and supporting repositories.
- `A11-K` is separately accessible and currently contains `build-bot-buddy` and `a11k-core`.
- `angellllkr-eng` is also accessible and contains additional A11-K/MindReply work including `opportunity-radar`, `resellerpro-platform`, `agent-control-plane`, `a11k-surface`, `mindreply`, and related projects.

### High-priority repositories
| Priority | Repository | Why |
|---|---|---|
| P0 | `Mind-Reply/A11-K` | NOVA surface, current visual/runtime state, public command surface |
| P0 | `Mind-Reply/mind-reply-core` | largest active product/core estate; landing pages, deployment, health, Docker |
| P0 | `Mind-Reply/control-plane` | owner/control plane, AGENTS, org stewardship, automation |
| P0 | `angellllkr-eng/resellerpro-platform` | revenue/product path, E2E, deployment, provider mutations |
| P0 | `angellllkr-eng/opportunity-radar` | live-opportunity research/fulfillment system |
| P1 | `Mind-Reply/n8n-workflows-private` | automation contracts and workflows |
| P1 | `Mind-Reply/mindreply` | large private legacy/product estate |
| P1 | `Mind-Reply/mind-reply.com` | canonical brand/site repo, currently very small on main |
| P1 | `Mind-Reply/a11k-engine-private` | private A11-K engine |
| P1 | `Mind-Reply/mindreply-brands` | brand system |
| P1 | `Mind-Reply/am-service-ads-engine` | advertising engine |
| P1 | `Mind-Reply/whatsapp-ai-router` | communication product surface |
| P1 | `Mind-Reply/Aurel` | product/brand candidate |
| P1 | `angellllkr-eng/agent-control-plane` | adjacent control-plane implementation |

### Branch pressure observed
- `Mind-Reply/A11-K`: 9 branches including frontier/automation/improvement lines.
- `Mind-Reply/mind-reply-core`: 30+ branches spanning feature, fix, platform, frontier, ops, release and reconstruction tracks.
- `Mind-Reply/control-plane`: multiple automation/frontier/ops/platform/identity branches.
- `Mind-Reply/n8n-workflows-private`: multiple automation/frontier/improvement/reconstruct branches.
- `angellllkr-eng/opportunity-radar`: 4 branches.
- `angellllkr-eng/resellerpro-platform`: 11 branches including production hardening and provider-independence tracks.
- `Mind-Reply/mind-reply.com`: main only.

**Observed pattern:** too many parallel branches relative to the number of clearly visible open PRs on the key repos. The safest improvement is consolidation + verification, not creating more branches.

## 2. Immediate architecture decision

Use one control hierarchy:

`Mind-Reply/A11-K` = NOVA command / evidence surface  
`Mind-Reply/control-plane` = owner control/orchestration  
`Mind-Reply/mind-reply-core` = core product/site factory  
`angellllkr-eng/opportunity-radar` = opportunity intelligence  
`angellllkr-eng/resellerpro-platform` = commercial/fulfillment product path  
`Mind-Reply/n8n-workflows-private` = automation execution layer

Everything else becomes a leaf/product/experiment/legacy asset.

Do not merge repositories merely to make the graph look clean.

## 3. The execution method that will not get stuck

### Gate 0 — Inventory
For every accessible repo record:
- default branch
- active branches
- archived state
- recent activity
- top-level files/directories
- CI/workflows
- agent instructions
- deployment markers
- likely product role

Status: `MAPPED`.

### Gate 1 — Branch triage
Every non-default branch gets one label:
- `MERGE-CANDIDATE`
- `CHERRY-PICK`
- `SUPERSEDED`
- `KEEP-ACTIVE`
- `ARCHIVE-LATER`
- `NEEDS-CI`

Never delete a branch during the first pass.

### Gate 2 — File/automation truth
For each P0 repo inspect, at minimum:
- README / identity docs
- package/build files
- env examples
- agent instructions
- `.github/workflows/*`
- tests / E2E
- deployment config
- Dockerfiles
- database/migration references
- auth/security config
- visual/design source
- analytics/payment surfaces
- known TODO/FIXME/BROKEN markers

### Gate 3 — One canonical path
For each P0 repo choose:
- source branch
- build command
- test command
- deployment path
- smoke-test path
- rollback path

No second competing path becomes “production” without proof.

### Gate 4 — Safe change
Make one small reversible change per cycle.
Preferred order:
1. broken CI
2. broken build
3. missing verification
4. missing monitoring
5. deployment gap
6. security hygiene
7. UX/visual improvement
8. revenue feature

### Gate 5 — Proof
A change is only complete when the relevant check exists:
- file exists
- build passes
- test passes
- CI passes
- deployment checked
- live page checked
- source timestamp recorded

## 4. Repository-specific next moves

### `Mind-Reply/A11-K`
Already contains `NOVA_PRIME`, `.github`, `app.js`, `index.html`, `style.css`, `PRODUCT_IDENTITY.md`, and a CNAME on `main`.

**Next:** make NOVA's repo state + evidence + branch policy canonical. Do not turn A11-K into a second product core.

### `Mind-Reply/mind-reply-core`
Active commits on 2026-08-12 include Vercel static-framework fixes, landing-page rebuilds, Vercel deployment configs, a landing-sites index, and a NOVA health/deploy framework. The repo also contains deployment/verification docs and multiple Dockerfiles.

**Next:** stop adding parallel platform branches until `main` has one verified build/deploy/smoke path. Reconcile the active frontier/fix/platform branches into a single promoted line.

### `Mind-Reply/control-plane`
Main contains `.github`, `AGENTS.md`, `APP_SITE_CONTRACT.md`, `FRONTIER.md`, `ORG_STEWARDSHIP.md`, `PRODUCT_IDENTITY.md`, `README.md`, Docker support and multiple active automation/ops branches.

**Next:** make this the owner-control implementation, not another place for duplicated core product work. Consolidate the strongest owner-observability/automation branch only after CI and runtime checks pass.

### `angellllkr-eng/opportunity-radar`
Main contains architecture, coverage, design, security, action-kits, config, delivery and docs plus a dated Live Opportunity Monitor PDF.

**Next:** establish one canonical `current-register.md` and one refresh/verification command. Do not multiply opportunity branches.

### `angellllkr-eng/resellerpro-platform`
Main contains E2E, Vercel ignores, action plans, API reference, deployment readiness material and active provider/deployment work. Recent commits include provider restoration for production, redeploy, E2E/revenue checklists and independence/provider-mutation work.

**Next:** keep provider mutations fail-closed, make the production-readiness path canonical, and verify the E2E revenue path before any domain mutation is enabled.

### `Mind-Reply/n8n-workflows-private`
Main has `AUTOMATION_CHARTER.md`, `FRONTIER.md`, `PRODUCT_IDENTITY.md`, contracts, docs and workflows.

**Next:** make this the single source of truth for automation definitions/contracts; avoid duplicating automation logic in product repos.

### `Mind-Reply/mind-reply.com`
Main currently has only `.github` and `README.md` at the root.

**Next:** do not treat this as the product implementation until the actual deployment source of truth is identified and verified. Link it to the real site repository rather than rebuilding blindly.

## 5. Branch policy from now on

Use branch names only for real work:
- `fix/...`
- `feat/...`
- `ops/...`
- `docs/...`
- `release/...`
- `plan/...`

Avoid repeated `frontier/...` branches unless they have a dated deliverable and explicit merge owner.

Every branch must end in:
`merge` | `cherry-pick` | `superseded` | `archive-later`.

No branch should become permanent by inactivity.

## 6. P0 execution order

**Phase A — 60-90 min**
1. Finish repo inventory for all P0/P1 repos.
2. Record default branch + branch counts + key files + CI/deploy markers.
3. Mark branch purpose/status.

**Phase B — 60 min**
1. `A11-K`: canonical NOVA state/evidence.
2. `mind-reply-core`: one verified build/deploy/smoke path.
3. `control-plane`: one owner-observability path.

**Phase C — 60 min**
1. `opportunity-radar`: canonical register + verification.
2. `resellerpro-platform`: production-readiness/E2E gate.
3. `n8n-workflows-private`: automation contracts.

**Phase D — repeat daily**
One real change per cycle; never more than one risky merge at a time.

## 7. “Done” definition

The estate is considered organized only when:
- every active repo has an explicit role;
- every P0 repo has one canonical branch path;
- every active branch is classified;
- every P0 repo has a known build/test/deploy/smoke path;
- production claims have evidence;
- automation has an owner/source of truth;
- domain/provider mutations remain fail-closed until verified;
- duplicate/archived repos are documented, not silently deleted.

## 8. Human decisions kept to the minimum

Only ask the owner when an action is genuinely irreversible or external:
- payment
- legal acceptance
- identity verification
- live domain/provider mutation
- irreversible deletion
- consequential external outreach.

Everything else should be prepared and verified autonomously.

## 9. Required next artifacts

Create and maintain in `Mind-Reply/A11-K/NOVA_PRIME/`:
- `REPO_REGISTER.md`
- `BRANCH_REGISTER.md`
- `FILE_CONTROL_MATRIX.md`
- `DEPLOYMENT_TRUTH.md`
- `AUTOMATION_REGISTER.md`
- `REVENUE_PATHS.md`
- `HANDOFF.md`

Each file must contain timestamps and evidence links.

## 10. Next executable piece

Start with `Mind-Reply/A11-K` and `Mind-Reply/mind-reply-core` only:

1. classify every branch;
2. compare each active branch to `main`;
3. identify the single strongest candidate for promotion;
4. do not merge yet;
5. write the exact merge/cherry-pick/test order into `BRANCH_REGISTER.md`;
6. then perform one safe verification step.

This keeps the estate moving without creating another wave of parallel work.
