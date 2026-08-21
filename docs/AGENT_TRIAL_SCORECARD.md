# A11-K Agent Trial Scorecard

## Purpose
Run three specialist approaches against the same product objective before selecting a canonical implementation.

## Specialists
- Architect: strongest product/technical route; minimize unnecessary surface area.
- Builder: fastest reversible implementation using existing code and assets.
- Auditor/Breaker: adversarial UX, reliability, security, performance and recovery review.

## Scoring
1. Working functionality — 30%
2. Reliability/recovery — 20%
3. Differentiation/positioning — 20%
4. Speed to verified result — 15%
5. Maintainability — 10%
6. Visual quality — 5%

## Decision rule
No winner from prose alone. A proposal must produce evidence: build/test result, route/smoke evidence, change set, and recovery path.

## Safety
- Work on isolated branches first.
- Preserve known-good production state.
- Never bypass authentication, secrets, billing, DNS or destructive data controls.
- Prefer reversible changes.
- Promote only after independent verification.
- If evidence conflicts, stop and request owner decision.

## Portfolio application
Apply this trial to MindReply, A11-K, ResellerPro, Radar and WhatsApp Router first. Reuse winning patterns only after product-specific validation.
