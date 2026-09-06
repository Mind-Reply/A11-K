# A11-K / Mind-Reply Canonical Reconstruction Audit

**Date:** 2026-09-06
**Source of truth:** GitHub
**Delivery/observability:** Vercel
**Design/control-plane:** Figma
**Publishing surface:** WebsitePublisher
**Execution rule:** evidence before trust; owner approval before irreversible production changes.

## Verified estate evidence

### GitHub — A11-K
- Repository: `Mind-Reply/A11-K`
- Default branch: `main`
- Current main tree commit inspected: `5893efa91b1a2095781e5c4fba2524e58e455556`
- Repository contains a substantial mixed estate: public surface HTML, product/brand material, nested Brushworks assets, documentation, source code, and multiple GitHub Actions workflows.
- Existing operating doctrine explicitly defines a Proof Graph (`claim -> source -> test -> artifact -> decision`) and a Reality Index. This is retained as the canonical governance model.

### Vercel — authorised `a11-k` team
- Team plan: Hobby.
- Project `a11-k` is GitHub-linked to `Mind-Reply/A11-K`.
- Node runtime currently reports `24.x`.
- Latest deployment inspected: READY, branch `ops/reality-fabric-2026-09-06`, commit `4b37ccf8201df57187899c9b2d81afaf84391030`.
- Main production deployment inspected: READY, commit `5893efa91b1a2095781e5c4fba2524e58e455556`.
- Project currently reports `live: false`; therefore deployment readiness must not be interpreted as canonical production liveness.
- Several recent preview deployments exist for reality-proof, event/settlement, verification, and reconstruction work. They remain evidence surfaces, not production-routing changes.

### Vercel — other projects
- `alphawin-color-advisor`: exists without GitHub binding; classify as uncontrolled/provisional until source ownership is established.
- `accounting-asset-monitoring`: exists without GitHub binding; classify as uncontrolled/provisional until source ownership is established.
- `chatneo`: GitHub-linked to `Mind-Reply/chatneo`; repository is currently archived, so deployment/source status requires explicit reconciliation before reuse.

## Canonical product candidates

### A11-K public/reality surface
Evidence: current `Mind-Reply/A11-K` root and docs contain the A11-K reality standard, global positioning, agent surface, brand system, and evidence/proof-graph material.

**Disposition:** canonical public/control-plane shell candidate. Keep GitHub as source; use Vercel only as delivery evidence.

### Sofia Tech Ledger
Evidence: `README.md` identifies the repository/product as a bilingual Sofia SME digitalisation intelligence system. `package.json` exposes ledger execution plus a Next.js web build.

**Disposition:** canonical product candidate within A11-K; do not split into another repository without evidence.

### Brushworks
Evidence: nested `Brushworks/` contains its own workflows, deployment documentation, ownership, portfolio, sales and release material.

**Disposition:** module/product candidate embedded in A11-K; reconcile against the standalone `brushworks` repository before merging or extracting.

### Event/content/settlement operating system
Evidence: recent Vercel preview deployment from `feat/event-content-settlement-os` and PR #21.

**Disposition:** active candidate module; not yet promoted to canonical production without review of PR and runtime evidence.

## Merge/reconciliation candidates

1. `Mind-Reply/A11-K` ↔ standalone `angellllkr-eng/a11-k-multiverse` / related A11-K surfaces: inspect actual files and commit ancestry before any merge.
2. A11-K nested `Brushworks/` ↔ standalone `brushworks`: compare trees and deployment bindings; no automatic deletion.
3. `Mind-Reply/mindreply` ↔ `Mind-Reply/mind-reply-core` ↔ `Mind-Reply/mindreply-control` ↔ `Mind-Reply/control-plane`: treat as separate until manifests/entrypoints/APIs prove module equivalence.
4. Archived `chatneo` ↔ current `chatneo` Vercel project: verify whether deployment is stale before any reuse.

## Broken/unsafe evidence found

The current `main` version of `.github/workflows/estate-report.yml` contains malformed shell syntax in the URL list and curl invocation, plus an owner DOB embedded in a generated report. This prevents treating the workflow as a trustworthy estate-health signal and unnecessarily exposes personal data in repository artifacts.

This branch replaces that workflow with a deterministic, privacy-safe evidence collector. It reports only URL status and repository metadata required for the audit.

## Security / dependency observations

- `package.json` declares Next.js `14.2.5` while the repository's recent deployment history includes a separate patched-runtime upgrade. Dependency state must therefore be reconciled against the actual lockfile/build output before declaring the runtime current.
- Existing workflows use mutable action tags such as `actions/checkout@v4`. GitHub has introduced stronger 2026 supply-chain protections and is moving toward deterministic workflow dependencies; immutable pinning should be introduced only after validating compatibility across the existing workflow set.
- Do not expose secrets, credentials, payment information or private customer data in evidence artifacts.

## Current blockers

1. Figma file inventory/node-level inspection is still required before design-system drift can be quantified.
2. WebsitePublisher page inventory has been observed, but publishing/runtime ownership must be mapped back to GitHub before treating any page as canonical.
3. Vercel `a11-k` reports `live: false` despite READY deployments; production liveness needs a verified URL/HTTP smoke test and routing interpretation.
4. Unbound Vercel projects require source reconciliation.
5. The large A11-K repository still contains multiple product-like surfaces and nested estates; canonicalisation must be based on manifests, entrypoints, APIs and deployment evidence, not repository names.

## Exact next actions

1. Compare the A11-K root, nested modules, and candidate repositories by file tree, manifests, entrypoints and API contracts.
2. Inspect PRs #20 and #21 and their CI/deployment evidence; promote only verified modules.
3. Run HTTP smoke tests against each Vercel deployment and compare results with GitHub commit SHA.
4. Obtain Figma file inventory and map components/tokens to canonical A11-K surfaces.
5. Reconcile WebsitePublisher pages against GitHub paths and classify duplicate/orphan publishing assets.
6. Add deterministic dependency/security checks after compatibility inspection; do not blindly upgrade production dependencies.
7. Keep all destructive, routing, credential, DNS, billing, archive and transfer operations owner-gated.
