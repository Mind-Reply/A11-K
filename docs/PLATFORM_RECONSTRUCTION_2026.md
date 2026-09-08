# A11-K Platform Reconstruction — 2026-09

## Decision

Reconstruct the estate around two deliberately different public faces with one operational spine:

- **Personal:** `A11-K Studio` — founder-led creative showcase, experiments, research surfaces and selected work.
- **Organization:** `A11-K — Flight Deck` — the authoritative operating and publishing surface for the Mind-Reply estate.
- **Source of truth:** GitHub.
- **Delivery:** Vercel where the application is a verified Vercel deployment; GitHub Pages only where explicitly retained as a public static surface.
- **Publishing surface:** WebsitePublisher, when the project is the correct publishing target.
- **Design system:** Figma as the editable design/control-plane layer; implementation remains code-owned.

This is a naming and architecture decision, not a claim that both surfaces are already deployed under these names.

## Reconstruction rules

1. Prefer one canonical implementation over parallel lookalikes.
2. Preserve valuable existing products and evidence; consolidate only verified duplicates.
3. Do not introduce a second production project when an existing project can own the surface.
4. Separate public presentation, private operations, integrations and data planes.
5. Every live claim needs an externally verifiable source.
6. Automation observes and prepares by default; consequential production mutations remain owner-gated.
7. Every integration has an explicit provider, scope, environment, data boundary, failure mode and recovery path.
8. Every scheduled job produces an evidence artifact or a bounded alert.

## Competitive platform structure

### 1. Experience plane

- Personal showcase and experimental work.
- Organization publishing and product surfaces.
- Responsive, accessible, reduced-motion-safe interfaces.
- Clear loading, empty, error, recovery and success states.

### 2. Control plane

- A11-K Flight Deck.
- Repository, deployment, automation, integration and evidence status.
- Owner approvals for irreversible actions.
- Rollback and recovery visibility.

### 3. Delivery plane

- GitHub branch/PR/check gates.
- Vercel preview and production deployments.
- Deployment smoke tests.
- Release evidence and rollback candidates.

### 4. Trust plane

- Secret scanning and dependency audit.
- Least-privilege workflow permissions.
- No secrets in public content or generated artifacts.
- Supply-chain review for actions and dependencies.
- Honest production-status language.

### 5. Intelligence plane

- Research and competitive signals.
- Content generation only from verified inputs.
- Structured evidence rather than unsupported claims.
- Human approval before external communications or commercial commitments.

## 2026 maintenance baseline

The repository steward is the first continuous maintenance layer. It now combines:

- hourly repository inspection;
- explicit `GITHUB_TOKEN` minimisation via read-only contents permission;
- credential-pattern detection;
- dependency installation without lifecycle scripts;
- high-severity npm audit gate;
- bounded issue alerting;
- short-lived evidence artifacts;
- concurrency control to avoid overlapping maintenance runs.

The web runtime is upgraded from the previously observed Next.js 14.2.5 line to patched Next.js 16.3.3, with React 19 types/runtime alignment. Build and runtime verification remain mandatory before treating the upgrade as production-complete.

## Automation map

Existing A11-K workflows already cover hourly stewardship, four-hour cycles, sales pulse, daily content, link health, SEO baseline, leak protection and Flight Deck reporting. The reconstruction therefore **extends existing automation instead of multiplying duplicate schedulers**.

## Next gates

- Verify the upgraded runtime with CI and Vercel preview.
- Verify public URLs and critical navigation externally.
- Review workflow failures and dependency findings.
- Reconcile the personal `A11-K Studio` surface with the existing personal repository before creating another project.
- Keep WebsitePublisher at one project until the plan supports a second canonical project or an existing project can be safely repurposed without data loss.

## Status vocabulary

`Planned` → `In progress` → `Implemented` → `Locally verified` → `Externally verified` → `Production` → `Verified complete`.

No state may skip evidence.
