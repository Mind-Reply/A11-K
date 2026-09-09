# A11-K Autonomous Runtime Contract

## Purpose

Define the minimum production contract for autonomous execution across GitHub Actions, deployment providers, workers, and observability systems.

## Operating loop

1. **Observe**: collect health, deployment, queue, and error signals.
2. **Decide**: select only bounded, allow-listed actions.
3. **Act**: execute one idempotent action with a correlation ID.
4. **Verify**: confirm expected state and endpoint behaviour.
5. **Record**: persist outcome, evidence link, duration, and rollback reference.
6. **Recover**: retry transient failures with backoff; stop on policy violations.

## Worker queue contract

Every job MUST include:

- `job_id`: globally unique identifier.
- `kind`: allow-listed job type.
- `correlation_id`: ties logs, deployments, and notifications together.
- `attempt`: starts at `1` and increments on retry.
- `max_attempts`: bounded upper limit.
- `dedupe_key`: prevents duplicate side effects.
- `requested_at`: ISO-8601 timestamp.
- `owner_gate`: `automatic`, `review_required`, or `blocked`.

Workers MUST be idempotent, time-bounded, and safe to replay. A job that reaches `max_attempts` moves to a dead-letter state with an actionable error summary.

## Observability minimum

Emit structured records for:

- job accepted, started, retried, completed, failed, dead-lettered;
- deployment requested, ready, failed, rolled back;
- health probe status and latency;
- provider authorization failures;
- policy or safety guard failures.

Required fields: `timestamp`, `service`, `environment`, `severity`, `event`, `correlation_id`, `duration_ms`, and `outcome`.

## Deployment hardening

- Production verification must be read-only by default.
- No workflow may create credentials, change billing, or contact customers without an explicit owner-approved path.
- Every production mutation requires a rollback reference.
- Provider access failures are reported as `blocked`, never as `healthy`.
- Main-branch verification must fail closed on HTTP errors, empty responses, missing markers, or unsafe repository artifacts.

## Go / no-go gate

A release is **GO** only when:

- repository checks pass;
- production endpoint returns the expected status and content marker;
- provider deployment is reachable and authorized;
- no unresolved fatal runtime error is present;
- evidence is recorded for the release commit.

Otherwise status is **NO-GO** with the blocking condition recorded.
