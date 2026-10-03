# OTA Suite — Canonical Implementation

This directory is the single canonical implementation home for the A11-K OTA Suite.

## Source-of-truth rule

- Implementation lives here: `/ota-suite`
- Do not create another OTA Suite repository.
- Do not maintain parallel implementations in other A11 repositories.
- Other repositories may contain historical references, integration references, or documentation, but they are not implementation sources of truth.
- Changes to the OTA Suite must originate here and be verified from Git history.

## Current integration

The repository-level `docker-compose.yml` already declares the OTA Suite services:
- `ota-suite-api`
- `ota-suite-frontend`

The canonical implementation must satisfy those build paths.

## Consolidation gate

Before calling the suite runnable, verify:
1. API build context and Dockerfile exist.
2. Frontend build context and Dockerfile exist.
3. Model service and API source are internally consistent.
4. Health endpoint works.
5. Policy enforcement is tested.
6. Audit logging does not expose secrets or sensitive request payloads.
7. CI validates the canonical tree.
8. No duplicate OTA implementation is introduced elsewhere.

Status: **CONSOLIDATION IN PROGRESS**
