# A11-K Agent Trial Harness

Purpose: compare three specialist paths on the same product outcome and keep only evidence-backed improvements.

## Trial lanes

1. Architect — strongest product strategy, architecture and non-obvious route.
2. Builder — fastest complete implementation with production discipline.
3. Auditor — adversarial verification, breakage discovery and recovery proof.

## Products

- MindReply — visitor intent capture, qualification and routing; target: stronger conversion without adding interface noise.
- A11-K — owner command surface; target: decision-first orchestration with reversible execution and visible proof.
- ResellerPro — domain discovery and transaction flow; target: shortest trustworthy path from intent to completed transaction.
- Radar — opportunity intelligence; target: evidence-to-action rather than dashboard-only output.
- WhatsApp Router — routing and fallback; target: reliable conversation delivery across provider failure modes.

## Scoring

Score 0-10 for: outcome impact, time-to-proof, originality, reliability, UX clarity, performance, maintainability, recovery quality, security posture, and evidence quality.

Total = impact*2 + reliability*2 + recovery*2 + evidence*2 + originality + time-to-proof + UX + performance + maintainability + security.

No winner without proof. A visually stronger result loses to a measurably better working result.

## Selection rule

Architect proposes conservative + unconventional routes.
Builder ships the smallest complete vertical slice.
Auditor independently attacks it.
Command Atelier reconciles evidence.
Releasekeeper selects the best implementation, or combines compatible parts, then gates production.

## Recovery rule

R0 observe/report.
R1 reversible recheck/retry.
R2 controlled recovery only with strong evidence.
R3 owner gate for consequential actions.

A repeated failure without new evidence is a stop condition, not permission to retry harder.

## Vercel/GitHub pattern

Use branch previews for trial candidates, keep production canonical, use deployment environments/concurrency for release control, and retain a known-good rollback target. GitHub supports environment protection and concurrency; Vercel keeps deployments immutable and supports instant rollback.
