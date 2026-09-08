# A11-K Autonomous Cloud Brain Runbook

## Operating loop

1. **Observe** — scheduled workflows inspect repository state and the production surface.
2. **Decide** — deterministic scripts and guardrails classify the result as healthy, degraded, or blocked.
3. **Act** — only bounded repository updates are automated; no billing, secrets, or external customer messages are mutated.
4. **Verify** — production URL, content marker, and safety invariants are checked after changes.
5. **Record** — workflow summaries and `ops/` state files provide an evidence trail.
6. **Recover** — failed runs create a visible GitHub signal; rollback is performed by reverting the associated commit.

## Required production gates

- GitHub Actions workflow is green.
- Canonical Vercel URL returns HTTP 200.
- Response contains the `A11-K` marker.
- No committed `.env` file or `.next` directory.
- Changes land through reviewable commits or pull requests.
- Slack delivery is optional and fail-closed: it activates only when `SLACK_WEBHOOK_URL` is deliberately configured as a repository secret.

## Worker-queue contract

Any future worker must be idempotent, bounded by a timeout, safe to retry, and emit a durable result record under `ops/` or an approved data store. Consequential actions require explicit owner approval before execution.

## Observability minimum

Every automated run should expose: run timestamp, commit SHA, status, duration, affected surface, verification result, and a direct link to the workflow run. Secrets, credentials, payment details, customer PII, and private ledger data must never be written to logs or artifacts.
