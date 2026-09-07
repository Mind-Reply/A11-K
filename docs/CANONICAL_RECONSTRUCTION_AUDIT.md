# A11-K / Mind-Reply Canonical Reconstruction Audit

**Date:** 2026-09-07
**Source of truth:** GitHub
**Delivery/observability:** Vercel
**Design/control-plane:** Figma
**Publishing surface:** WebsitePublisher
**Execution rule:** evidence before trust; owner approval before irreversible production changes.

## Reconstruction pass — GitHub + Vercel

This pass inspected actual repository files/trees, application entrypoints, package/runtime configuration, Vercel project/deployment metadata, build output, runtime errors, and live HTTP output. No deletion, archive, rename, transfer, DNS, credential, billing, production-routing, or external-communication mutation was performed.

## 1. Canonical source reality

### A11-K
- Repository: `Mind-Reply/A11-K`, default branch `main`.
- Root is a mixed estate: static public surfaces (`index.html`, other HTML), Next.js application code under `app/`, nested `Brushworks` and `NOVA_PRIME`, brand/product documentation, Docker assets and a substantial automation estate.
- `app/` contains `page.tsx`, `layout.tsx`, `globals.css`, `capability/`, and `world-engine/`.
- `package.json` declares `sofia-tech-ledger` v0.2.0, Next.js 14.2.5, React 18.3.1, Node `>=20`, and both Next web and Node ledger execution scripts.
- `vercel.json` explicitly sets `framework: null` and `outputDirectory: "."`.

### Critical routing finding
The live A11-K Vercel production surface is **not currently the Next.js `app/page.tsx` application**. Vercel is configured to publish the repository root, and the live HTML returned by the production alias matches root `index.html` in structure/content.

**Canonical public delivery today = root static A11-K surface.**
**Next.js app = source-resident application/module estate, not proven as the live public route.**

This distinction must remain explicit until a deliberate routing decision is owner-approved.

## 2. Vercel delivery state

- Team: `a11-k`.
- Canonical project: `a11-k`, linked directly to GitHub `Mind-Reply/A11-K`.
- Project currently reports Node `24.x`.
- Latest production deployment inspected for audit commit `ca90f0a443b9f275a32421086c7f220bd18465a1` is `READY`; aliases include `a11-k-rho.vercel.app`, `a11-k-a11-k.vercel.app`, and `a11-k-git-main-a11-k.vercel.app`.
- A newer feature deployment from `feat/activate-revenue-guard` is currently `BUILDING`; it is not production truth until `READY` and target/alias are verified.
- Production history contains many successful superseding deployments and several canceled builds. Canceled deployments alone are not evidence of instability; classify them by branch/commit and supersession.
- Runtime error aggregation for the canonical project returned **no runtime errors in the last 7 days**.
- The current building deployment emits a warning because `package.json` declares a floating `>=20` engine range. Vercel is using Node 24.x, but source should eventually pin the intended major for reproducibility.

## 3. Live HTTP reality

The production GitHub-main alias returned HTTP **200 OK** from Vercel. The returned document is the A11-K static public surface with A11-K/MindReply branding, Realtime/Control/Proof positioning, Copilot/Sites/Working Standard links, responsive/mobile CSS and reduced-motion handling.

The document's canonical link currently points to `https://mind-reply.github.io/A11-K/`. This is SEO/routing metadata drift, not a runtime outage, and must not be changed without owner approval.

## 4. Product reconstruction

### Canonical
1. **A11-K Flight Deck / public reality surface** — canonical governance/public shell.
2. **Sofia Tech Ledger** — substantive product implementation currently housed inside A11-K; no evidence yet justifies extracting it.
3. **Capability + World Engine** — active A11-K modules, not independently canonical products until route/API/data ownership is proven.
4. **Brushworks** — embedded module/product candidate; standalone reconciliation remains open.

### Mind-Reply candidates requiring reconciliation
- `Mind-Reply/mindreply`: real workspace-style monorepo with `apps/*` and `packages/*`; Node `>=18`, so it has a separate runtime policy from A11-K.
- `Mind-Reply/mind-reply-core`: actual source estate containing AUREL, assistant, atlas, pilot, profit, reseller, mail and multiple `site-*` surfaces. This is a substantive reuse/merge candidate, not an orphan by default.
- `Mind-Reply/mindreply-control`: source ownership/control-plane candidate; exact internal structure still requires inspection.
- `Mind-Reply/agent-control-plane`, `a11k-operator-desk`, `a11k-surface`, `a11-k-multiverse`: operator/control-plane candidates requiring file-level comparison before merge decisions.

### Provisional / orphan / archived
- Vercel projects without GitHub bindings: `alphawin-color-advisor`, `accounting-asset-monitoring` — uncontrolled/provisional until source ownership is established.
- `chatneo`: GitHub-linked Vercel project; source/deployment reconciliation remains open.
- GitHub contains genuinely archived repositories including `chatbot`, `chatbot1`, `linear-card-interaction`, `leadrevive`, `empirepulse`, and `marginpilot`. They remain historical assets; no lifecycle changes were made.
- Small/empty repositories such as `source1`, `source2`, `revenuepulse`, `leadrevive`, `empirepulse`, `marginpilot` must be classified by actual contents/history, not names.

## 5. Revenue / API / data reality

Targeted A11-K searches for Stripe, checkout, payment, webhook, database/schema and route-handler terms returned no code-search matches. This does **not** prove those capabilities are absent because GitHub search is not a complete filesystem inventory.

Status:
- Public revenue doctrine: **PRESENT**.
- Runtime payment execution: **UNPROVEN**.
- Fulfilment: **UNPROVEN**.
- Durable order/revenue persistence: **UNPROVEN**.
- Model-independent revenue policy: **SOURCE PRESENT; LIVE EXECUTION PROOF INCOMPLETE**.

No revenue claim should be promoted to verified merely because a deployment exists.

## 6. Automation health

`.github/workflows` contains a broad automation estate including four-hour cycle, hourly sales, amplifier, daily content, estate reporting, hourly Flight Deck, leakguard, ledger, link health, pulse, reality proof, repository stewardship and sentinel workflows.

The architecture has strong automation intent but a **control-plane normalization problem**: ownership, cadence, permissions, failure semantics and overlapping responsibilities are distributed across many workflows. Recent-run/job/log inspection is required before treating automation as authoritative.

## 7. Security / dependency / platform findings

- Next.js 14.2.5 is materially behind patched releases. Vercel's May 2026 security notice states all Next.js 13.x/14.x versions were affected by multiple advisories and recommends patched 15.5.18 or 16.2.6+ lines. Upgrade must be tested against the mixed static/Next architecture rather than applied blindly.
- Vercel is correctly on Node 24.x. The repository's floating `>=20` declaration is weaker than the delivery environment and should eventually be pinned.
- Vercel states Node 20 will be disabled for new deployments on October 1, 2026, reinforcing the need to remove runtime ambiguity.
- No credentials or secrets were exposed or modified.
- No destructive repository/Vercel lifecycle operation was performed.

## 8. Architecture conclusion

The estate is **not one application**. It has at least three layers:

**Layer A — Public delivery:** root static A11-K surface currently served by Vercel.

**Layer B — Application/product runtime:** Next.js/TypeScript application and Sofia Tech Ledger modules inside A11-K, plus larger Mind-Reply source estates.

**Layer C — Operator/control infrastructure:** control-plane, automation, registrar, reseller and monitoring repositories.

The correct reconstruction strategy is **reconciliation before consolidation**, not mass merging.

## 9. Current blockers

1. Complete A11-K route/API/schema/manifest/lockfile inventory.
2. Prove which Next.js routes are intended to become live versus remain source modules.
3. Resolve static-root-vs-Next routing architecture deliberately.
4. Build revenue execution proof from checkout/payment through durable record/fulfilment.
5. Inspect workflow runs/jobs/logs and normalize automation ownership.
6. Inspect `mind-reply-core`, `mindreply`, `mindreply-control`, `agent-control-plane`, `a11k-operator-desk`, `a11k-surface` and `a11-k-multiverse` by actual files before merge classification.
7. Obtain complete Figma node/token/component inventory and reconcile against deployed surfaces.
8. Reconcile WebsitePublisher pages against GitHub/Vercel ownership.
9. Resolve canonical URL metadata drift only after owner approval.
10. Establish a tested dependency upgrade path for Next.js rather than upgrading production blindly.

## 10. Exact next execution sequence

1. Enumerate every A11-K directory/file of architectural significance: routes, API handlers, schemas, data stores, lockfiles, manifests, Docker/config, tests and workflows.
2. Inspect the primary Mind-Reply/control-plane candidate repositories at file level and build a module-to-module overlap graph.
3. Inspect recent GitHub Actions runs and logs and classify failures versus expected supersession.
4. Inspect the latest Vercel production and building deployments against their exact Git SHAs; run route-level HTTP smoke tests.
5. Decide, with owner approval, whether A11-K remains static-root canonical or promotes the Next.js application to delivery.
6. Only after that decision, prepare a non-destructive migration/merge PR with rollback evidence.

**Owner-gated rule:** no delete/archive/rename/transfer, DNS, credentials, billing, production-routing or external communication changes without explicit owner approval.
