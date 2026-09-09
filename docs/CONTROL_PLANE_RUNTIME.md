# A11-K Control Plane Runtime

## Boundary

The control plane is the authority for identity, policy, approvals, state, audit and execution intent. Models and external services are replaceable adapters.

## Execution contract

`observe -> reason -> plan -> authorize -> execute -> verify -> record`

No worker may bypass policy or write privileged state without an auditable execution context.

## Risk classes

- R0: read-only
- R1: bounded and reversible
- R2: external side effect
- R3: production, financial or destructive

R2/R3 actions require explicit policy evaluation; R3 requires owner approval unless an explicitly versioned automation policy grants it.

## Reliability

Every job has an idempotency key, correlation ID, deadline, bounded retries and a terminal dead-letter state. No unbounded autonomous loop is permitted.

## Model independence

Business logic consumes capabilities, not provider names. Model adapters expose a common request/response contract so providers can be shadow-tested, promoted or rolled back independently.

## Evidence

A successful execution is not merely a returned response. Verification must produce an observable result and an audit event tied to the same correlation ID.
