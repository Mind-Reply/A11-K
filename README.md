# A11-K — Sofia Tech Ledger

A11-K is the distinct Mind-Reply regional intelligence and owner-operations product. It is **not** the canonical MindReply public web root.

## Product function

A11-K provides an evidence-first surface for regional technology intelligence, operational records, owner workflows and deployment/evidence coordination. It may consume shared MindReply control-plane services, but it retains its own product identity and release boundary.

## Canonical estate relationship

- MindReply production source: `Mind-Reply/mindreply`
- Control plane: `Mind-Reply/control-plane`
- A11-K: this repository
- Aurel experience product: `Mind-Reply/Aurel`
- Migration/reference source: `Mind-Reply/mind-reply-core`

## Engineering contract

Source presence is not production proof. A11-K changes must be validated through manifests, entrypoints, tests, CI, deployment provenance and live HTTP checks before being described as live.

Do not place credentials, `.env` files, private keys or recovery material in the repository. Destructive deployment, routing, DNS and external-service changes require owner approval.

## Current status

Active product repository. Deployment parity with the canonical MindReply delivery estate remains independently verifiable and must not be inferred from repository state alone.

Cross-estate evidence and classification: `Mind-Reply/mindreply/ESTATE_RECONSTRUCTION_AUDIT_2026-09-13.md`.
