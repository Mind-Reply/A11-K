# OTA Suite Canonicalization

## Decision

The OTA Suite is consolidated under **Mind-Reply/A11-K**.

## Existing references inspected

- `Mind-Reply/A11-K/docker-compose.yml` already contains the OTA Suite integration.
- `angellllkr-eng/a11k-orchestration` contains an `ota-suite/` platform reference.
- `angellllkr-eng/own-agent` contains OTA Suite architecture/instructions.
- No separate canonical OTA Suite repository was found.

## Rule

`Mind-Reply/A11-K/ota-suite/` is the implementation source of truth.

The other locations are treated as references until their implementation content is reconciled into this canonical tree. No new OTA repository should be created.

## Verification requirements

A consolidation is not considered complete merely because files exist. The canonical tree must pass build, type, test, security, and smoke verification before production claims are made.

## Known pre-consolidation condition

The repository-level Compose configuration expects:

```
./ota-suite/Dockerfile.api
./ota-suite/frontend/Dockerfile
```

Those paths must be reconciled with the supplied workspace builder before the suite can be called runnable.

## Evidence

This document records the canonicalization decision and the exact repository boundary. Git commit history is the implementation evidence.
