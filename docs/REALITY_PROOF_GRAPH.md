# A11-K Reality Proof Graph

Status: `IMPLEMENTED ON BRANCH` · not production-routing authority

## Purpose

Turn important estate claims into verifiable records instead of trusting names, UI labels, deployment state, or model output.

## Canonical chain

`claim → source → test → artifact → decision`

Each node must identify its source and evidence. A claim is not `VERIFIED` merely because a build is `READY`.

## Required claim states

- `UNKNOWN` — insufficient evidence
- `PARTIAL` — some evidence exists, but a required gate is missing
- `BROKEN` — direct evidence shows failure
- `DUPLICATE` — equivalent capability exists elsewhere; no destructive merge is implied
- `ORPHAN` — exists without a verified source/binding
- `FROZEN` — intentionally retained without active change
- `VERIFIED` — all required evidence gates pass

## Product-estate gates

1. Source exists in GitHub and its commit/ref is recorded.
2. Entrypoint/module/API/schema is identified from actual files.
3. Dependencies/configuration are inspectable and internally consistent.
4. CI/workflow evidence is recorded where applicable.
5. Vercel deployment identity and commit binding are recorded where applicable.
6. Runtime/HTTP smoke evidence is recorded where applicable.
7. Public claims match the evidence; unsupported LIVE/security/compliance claims are rejected.

## Non-destructive rule

This graph classifies and proposes. It does not delete, archive, rename, transfer, alter DNS, alter credentials/billing, or change production routing.

## Control-plane interpretation

GitHub is the source-of-truth ledger. Vercel supplies delivery and runtime evidence. Figma supplies editable design intent. WebsitePublisher supplies publishing output. Disagreement between layers becomes a `REALITY_DELTA`, not an automatic merge.
