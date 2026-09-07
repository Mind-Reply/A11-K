# A11-K / Mind-Reply Canonical Reconstruction Audit

**Date:** 2026-09-07
**Source of truth:** GitHub
**Delivery/observability:** Vercel
**Design/control-plane:** Figma
**Publishing surface:** WebsitePublisher
**Execution rule:** evidence before trust; owner approval before irreversible production changes.

## Scope completed in this run

Inspected the A11-K repository tree, application entrypoints, package manifest, workflow inventory, recent Vercel project/deployment state, and WebsitePublisher capability inventory. No deletion, archive, rename, transfer, DNS, credential, billing, production-routing, or external-communication mutation was performed.

## Verified GitHub evidence

### Repository and entrypoints
- Repository: `Mind-Reply/A11-K`; default branch: `main`.
- Root contains a mixed estate: Next.js app, static HTML surfaces, brand/release documents, nested `Brushworks` and `NOVA_PRIME` estates, Docker assets, and operational documentation.
- App entrypoints present: `app/page.tsx`, `app/layout.tsx`, `app/capability`, `app/world-engine`.
- `package.json` identifies the codebase as `sofia-tech-ledger`, version `0.2.0`, with Next.js 14.2.5, React 18.3.1, Node >=20, and both web and ledger execution scripts.
- No checkout/payment/Stripe/API/schema files were returned by the repository code search query used in this run. This is not proof of absence; targeted path-level inspection is still required.

### Workflow/automation estate
- `.github/workflows` contains 15+ workflows including estate reporting, hourly flight-deck, link-health, leakguard, reality-proof, repository stewardship, daily content and sales-cycle automation.
- Automation surface is broad and overlapping. Canonical ownership, trigger cadence, write permissions, and failure semantics are not yet normalized across the workflow set.
- Existing audit history had previously identified malformed shell syntax and privacy leakage in an earlier estate-report implementation; current workflow files require line-level validation before being treated as reliable health signals.

## Verified Vercel evidence

### Canonical project
- Project `a11-k` is linked to GitHub `Mind-Reply/A11-K`.
- Latest inspected production deployment is `READY` and points to `main`, commit `b5de106655d3c989d3e9ea38b11ae9a31974fe97`, with commit message `ops: verify Vercel production after main changes`.
- The prior revenue-independent primary-surface deployment for commit `9ac566dd4fcdcbca4dd27611de3a3cb84dcb3623` is also `READY` on production.
- Multiple recent production and preview deployments are present; several are `CANCELED`. These must be classified as expected superseded builds versus build instability before using deployment count as a health metric.

### Other projects
- `chatneo` is GitHub-linked to `Mind-Reply/chatneo`.
- `alphawin-color-advisor` and `accounting-asset-monitoring` exist without GitHub bindings; classify as uncontrolled/provisional until source ownership and intended lifecycle are established.

## Canonical product and module reconstruction

### Canonical product candidates
1. **A11-K Flight Deck / public reality surface** — canonical shell and governance surface.
2. **Sofia Tech Ledger** — canonical intelligence product implemented inside A11-K; no evidence yet supports extraction into a separate repo.
3. **World Engine / capability surfaces** — active A11-K modules, not independent products until route/API/data ownership is proven.
4. **Brushworks** — embedded product/module candidate; standalone reconciliation remains open.

### Frozen, archived, orphaned, or provisional candidates
- **Provisional/uncontrolled:** Vercel projects without GitHub bindings: `alphawin-color-advisor`, `accounting-asset-monitoring`.
- **Archive-risk candidate:** `chatneo` requires explicit reconciliation because the linked repository has previously been identified as archived in audit history.
- **Orphan candidates:** any nested HTML/product surface without a current route, deployment reference, or owner metadata; exact classification requires route-by-route inventory.
- **Frozen candidates:** none promoted in this run; no lifecycle mutation was made.

### Merge/reconciliation candidates
- A11-K nested `Brushworks/` ↔ standalone `brushworks` repository.
- A11-K capability/world-engine modules ↔ any standalone A11-K multiverse/control-plane repositories.
- `Mind-Reply/mindreply`, `mind-reply-core`, `mindreply-control`, `control-plane`, and related operator repos.
- `chatneo` source ↔ Vercel `chatneo` deployment history.

No merge, extraction, or deletion is approved by evidence yet.

## Design/control-plane evidence

- Figma has a known editable Google-flow/action board from the current workstream, but this run did not obtain a complete design-file inventory or node-level component/token export.
- Design-system drift therefore remains unquantified. Required mapping: Figma file → pages/nodes → tokens/components → deployed route/surface → GitHub source path.

## WebsitePublisher evidence

- WebsitePublisher exposes live capabilities for page inventory, admin authentication, site import, monitoring, inventory, API proxying and external publishing integrations.
- A configured WebsitePublisher project (`My First Project`, project id 24053) is discoverable, but no evidence yet maps its pages or integrations to A11-K GitHub paths or Vercel deployments.
- Treat WebsitePublisher as a publishing surface only; do not treat its page names as canonical product ownership.

## Security, dependency and runtime findings

- `package.json` is materially behind current major Next.js releases; compatibility and lockfile state must be inspected before any upgrade.
- Runtime is configured on Vercel as Node `24.x`, while repository engine floor is `>=20`; this is compatible in principle but should be pinned and tested against the actual build output.
- Workflow action pinning and secret-scan coverage need line-level review. Do not introduce broad upgrades without a compatibility matrix.
- Revenue-critical path remains unverified at the payment, fulfilment, and durable revenue-record layers; the public revenue-independence doctrine exists, but runtime proof is incomplete.

## Current blockers

1. No complete route/API/schema inventory for A11-K and nested modules.
2. No lockfile/build-artifact inspection in this run.
3. No line-level workflow execution/status matrix yet.
4. Figma inventory and design-token/component drift not quantified.
5. WebsitePublisher page inventory not reconciled to GitHub/Vercel.
6. Vercel liveness needs HTTP smoke tests against the canonical production URL, not only deployment state.
7. Unbound Vercel projects lack source-of-truth ownership evidence.

## Exact next actions

1. Fetch all A11-K route directories, API handlers, schemas, manifests, lockfiles and workflow bodies; build a machine-readable surface inventory.
2. Run targeted searches for checkout, payment, fulfilment, Stripe, API routes, forms, lead capture and durable order/revenue persistence; classify each path `REVENUE_READY` or `REVENUE_BLOCKED`.
3. Inspect recent workflow runs and action logs; produce a trigger/owner/failure matrix and remove duplicate or misleading health signals only with approval.
4. Perform HTTP smoke tests for the latest `main` deployment and compare response evidence to the GitHub SHA.
5. Obtain Figma file/page/node inventory and map design tokens/components to canonical routes.
6. Use WebsitePublisher page listing on project 24053, then reconcile every published page to a GitHub path or mark it orphan/provisional.
7. Produce a candidate merge graph; keep all destructive lifecycle actions owner-gated.
