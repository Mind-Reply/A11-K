# A11 Frontier Designer — 24H Execution Skill

## Purpose

A production design-and-execution layer for A11-K. It combines the strongest documented mechanics from current frontier web/design skills without copying third-party skill text.

## 24H activation

This branch is the controlled 24-hour rollout window. The skill is designed to be used continuously during that window; the repository itself remains durable after the window so the capability can be reviewed, merged, or extended.

## Execution contract

For every design/build request:

1. UNDERSTAND — identify user, surface, goal, constraints, existing stack, routes and source of truth.
2. ART-DIRECT — define visual hierarchy, typography, spacing, density, interaction model, content tone and responsive behavior before implementation.
3. DESIGN SYSTEM — reuse existing tokens/components first; add primitives only when justified.
4. BUILD — implement the smallest coherent production change. Prefer existing architecture over parallel frameworks.
5. RENDER — inspect the actual rendered result at desktop and mobile breakpoints.
6. INTERACT — exercise primary navigation, forms, dialogs, loading/error/empty states and keyboard paths.
7. INSPECT — check layout overflow, hierarchy, contrast, focus states, broken assets, console/runtime errors and route integrity.
8. FIX — iterate until the rendered result satisfies the acceptance criteria; do not stop at source-level plausibility.
9. VERIFY — run available tests/checks and verify changed routes and public surfaces.
10. EVIDENCE — record changed files, verification results, screenshots or external checks when available.
11. SHIP — use a branch/PR unless direct production mutation is explicitly authorized.

## Design quality gates

- No generic template styling when the product has an established brand system.
- Typography and spacing must establish hierarchy before decorative effects.
- Primary action must be visually and semantically obvious.
- Every meaningful state has an intentional loading, empty, success and failure treatment.
- Responsive behavior is designed, not merely allowed to wrap.
- Accessibility is part of implementation: semantic HTML, keyboard access, visible focus, labels and usable contrast.
- Motion is purposeful and respects reduced-motion preferences.
- Do not invent product capabilities, metrics, testimonials or claims.

## A11/MindReply operating constraints

- Preserve owner control for irreversible actions.
- Never expose secrets or credentials.
- Prefer synthetic/demo data until real integrations are explicitly enabled.
- Treat GitHub source, deployment configuration and public rendering as separate verification layers.
- Keep public copy human-centered and avoid internal implementation jargon unless required.

## Required completion record

Every completed design execution should leave:
- objective and acceptance criteria;
- files/routes changed;
- verification performed;
- known limitations;
- rollback path or PR reference.

## Stop conditions

Stop and surface an Owner Action Packet when a required credential, domain/DNS change, account permission, billing action, irreversible deletion, or production approval is unavailable. Never simulate completion.
