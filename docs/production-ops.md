# A11-K production operations

## Release path

`main` is the release source. GitHub Actions validates the Node build, tests, Docker image, and `/healthz` contract. A successful build is not production evidence. Production is only reported after the configured ResellerPro host returns a successful health response.

## Required runtime controls

- ResellerPro secrets: `RESELLERPRO_SSH_HOST`, `RESELLERPRO_SSH_USER`, `RESELLERPRO_SSH_PRIVATE_KEY`, `RESELLERPRO_DEPLOY_PATH`
- Optional Slack notification: `SLACK_WEBHOOK_URL`
- Immutable image tag: commit SHA
- Health endpoint: `GET /healthz`
- Restart policy: `unless-stopped`

## Queue and automation boundary

Long-running automation must be idempotent, retryable, and observable. The application layer should expose a job identifier for each asynchronous task and record: requested time, started time, completion time, status, retry count, and terminal error. Irreversible actions require owner approval before execution.

## Observability minimum

Every request and background job should carry a correlation ID. Logs should be structured JSON and include `service`, `environment`, `release`, `correlation_id`, `job_id`, `event`, `duration_ms`, and `error_code` when applicable. Health checks must remain cheap and dependency-light; readiness checks may validate required runtime dependencies separately.

## Incident rule

Never claim a deployment is live from a green CI run alone. Use the target health endpoint and record the release SHA that was verified.
