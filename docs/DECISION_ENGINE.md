# A11-K Decision Engine

A11-K is governed by evidence, reversibility and confidence. Automation may prepare and execute low-risk recovery; consequential actions remain gated.

## Decision matrix

| Signal | Default decision | Backup | Verification |
|---|---|---|---|
| HTTP 5xx spike | retry once, then known-good deploy | rollback candidate | independent HTTP check |
| build failure with missing/generated artifact | rebuild after validating source | last known-good build | deployment READY + smoke path |
| DNS/routing anomaly | observe and compare resolver signals | owner latch | external URL resolution |
| dependency/service timeout | bounded retry with backoff | alternate provider/path | successful transaction/read |
| auth/identity anomaly | stop and latch | no automatic bypass | owner decision |
| secret/leak signal | quarantine and latch | credential rotation plan | clean scan |
| data/schema drift | stop write path | read-only/deferred migration | schema compatibility test |
| unknown failure | no blind mutation | owner latch | new evidence required |

## Fast path

1. Detect.
2. Assign fault class.
3. Score confidence and blast radius.
4. Select primary + fallback.
5. Execute only within the allowed risk tier.
6. Verify independently.
7. Record trace and outcome.
8. Stop if confidence drops or recovery repeats without improvement.

## Risk tiers

**R0** — observe/report.

**R1** — reversible operational actions: retries, rechecks, cache refreshes, rerunning deterministic checks.

**R2** — controlled recovery: restore known-good deployment, disable a failing feature flag, isolate a bad preview. Requires strong evidence.

**R3** — consequential: billing, identity, DNS, secrets, irreversible data, production architecture. Owner gate required.

## Portfolio rule

Every public property should have one canonical deployment, one known-good rollback target, one health contract and one recovery owner. Duplicate deployments are evidence, not products.

GitHub Environments, protected deployment rules and concurrency should gate production changes; reusable workflows should hold deterministic checks, while contextual agent work handles analysis and recommendations. Vercel immutable deployments provide a practical rollback target when a production release is unhealthy.
