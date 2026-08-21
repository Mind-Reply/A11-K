# Agent Scorecard

Each product gets three competing passes: Architect, Builder, Breaker.

Score 0-10 with evidence; no score without a test, artifact, or observable result.

- Outcome/value: 25%
- Reliability/end-to-end completion: 20%
- Distinctiveness/positioning: 15%
- Speed/efficiency: 10%
- UX/accessibility: 10%
- Security/provenance/compliance: 10%
- Maintainability/reversibility: 10%

## Winner rule
A candidate cannot win if it fails a critical safety gate, has unknown provenance for monetized assets, leaks credentials, or cannot demonstrate a working core journey.

If scores are close, prefer the approach with lower blast radius and easier rollback. If evidence conflicts, LATCH rather than average away the conflict.

## Uncommon-route requirement
Architect must propose at least one non-obvious route. It only enters implementation if it is lawful, reversible, testable and materially stronger on value, speed or differentiation.
