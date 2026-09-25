# A11-K production operating model

## Control plane

- GitHub is the source and evidence layer.
- GHCR stores immutable OCI images tagged with the commit SHA.
- ResellerPro is the execution layer.
- Production deployment is only successful after `/healthz` returns HTTP 200.
- Irreversible actions require owner approval; automation may prepare, validate, queue, and report but must not silently publish external side effects.

## Automation layer

Every job should carry:

- `correlation_id`: stable per request or workflow execution.
- `idempotency_key`: stable per logical action to prevent duplicates.
- `attempt`: retry counter.
- `created_at` / `started_at` / `completed_at` timestamps.

Recommended queue contract:

1. enqueue with an idempotency key;
2. claim with a lease and visibility timeout;
3. retry only transient failures with exponential backoff;
4. move exhausted jobs to a dead-letter queue;
5. record the result and release evidence.

Workers must be stateless. Durable state belongs in the configured data store, not in the container filesystem.

## Observability

Minimum production signals:

- request count, latency, error rate;
- queue depth, oldest job age, retry count, dead-letter count;
- deployment version and image digest;
- `/healthz` for process health;
- `/readyz` for dependency readiness;
- structured logs with correlation and idempotency keys.

Do not report a deployment as live from a build result alone. Live means the target runtime has responded successfully.

## Slack updates

Slack notifications are operational summaries only. They must include:

- release status;
- commit SHA prefix;
- target environment;
- verification result;
- a link to the workflow run.

Webhook secrets are never committed. Missing Slack configuration must not fail the release.
