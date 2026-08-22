# A.K. CEO Assurance Standard

Status: ACTIVE | Owner: A.K. | Execution mode: evidence-first

## Every task
Understand → Protect → Execute → Verify → Record → Handoff.

## Premium defaults
- Prefer local evidence and minimum permissions.
- Use synthetic data before real data.
- Never commit or expose secrets, payment data, customer PII or restricted financial records.
- Preserve originals and create a checkpoint before irreversible change.
- Never claim deployment, integration, customer, revenue or verification without direct evidence.

## Accounting boundary
Financial records, customer PII, Stripe/bank metadata, billing keys and ledger entries remain local-only for processing. External AI/model/vector services are prohibited for restricted accounting content. Secrets remain in OS credential storage and never appear in logs/issues/commits.

## Risk
READ = automatic.
LOW + reversible = automatic with verification.
MEDIUM = policy-gated.
HIGH = CEO approval.
CRITICAL = CEO approval + verification + rollback.

## Evidence receipt
Every meaningful action records: timestamp, repository, branch/commit, files changed, checks performed, result, rollback reference and next action. Sensitive values are excluded.

## Recovery
Classify failure before retry. Prefer the least-destructive reversible recovery. Verify independently after recovery. Escalate when evidence conflicts or authority is insufficient.

## Portfolio operating model
Architect finds the strongest uncommon route; Builder implements the smallest complete production slice; Breaker attacks it. The winning approach is selected by evidence, not confidence.

## Review cadence
Hourly: health/reality/market drift where configured.
Daily: security, CI, deployment and commercial readiness.
Weekly: architecture/disposition, dependency/license and cost/performance.
Monthly: privacy, workflow/export, integration safety and evidence review.

## Handoff states
VERIFIED / READY / BLOCKED / FAILED / UNVERIFIED.
Unknown is a first-class state; never convert it into a positive claim.
