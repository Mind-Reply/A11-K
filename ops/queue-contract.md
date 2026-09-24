# Worker queue contract

A11-K uses a provider-neutral queue boundary so ResellerPro, Redis, Postgres, or a managed queue can be selected without changing worker semantics.

## Job envelope

```json
{
  "id": "job-uuid",
  "type": "string",
  "payload": {},
  "correlation_id": "request-or-workflow-id",
  "idempotency_key": "stable-logical-action-key",
  "attempt": 0,
  "max_attempts": 5,
  "available_at": "2026-09-25T00:00:00Z",
  "lease_expires_at": null,
  "status": "queued"
}
```

## Required worker behavior

- Claim only jobs whose lease is available.
- Extend the lease while performing long work.
- Acknowledge only after the side effect and evidence write succeed.
- Retry transient errors with exponential backoff and jitter.
- Send exhausted jobs to dead-letter storage.
- Treat duplicate deliveries as normal; idempotency is mandatory.

## Production boundary

Workers may validate, enrich, route, and prepare actions automatically. External publication, billing, deletion, or other irreversible operations require an explicit owner-approved action token.
