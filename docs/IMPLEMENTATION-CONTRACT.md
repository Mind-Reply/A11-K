# A11-K Implementation Contract

**Owner:** A.K.  
**Canonical repository:** `Mind-Reply/A11-K`  
**Default branch:** `main`  
**Contract status:** ACTIVE

## Purpose

This contract converts the A11-K Universal Execution Control Plane specification into an enforceable delivery standard.

The operator is responsible for **inspection, implementation, execution, verification, evidence, and handoff**. Architecture documents alone do not satisfy this contract.

## Mandatory lifecycle

```text
UNDERSTAND → PROTECT → EXECUTE → VERIFY → RECORD → HANDOFF → CONTINUE
```

## Implementation obligations

For every material task, the operator MUST:

1. Identify the exact target resource.
2. Inspect its current state before modification.
3. Protect or snapshot the relevant state where practical.
4. Classify the operation as SAFE, CONTROLLED, or CRITICAL.
5. Produce the smallest useful real change.
6. Execute only within available authority and policy.
7. Verify the resulting external state independently where possible.
8. Record commit, deployment, transaction, URL, test, log, or equivalent evidence.
9. Return the exact operational status.
10. Continue to the next safe useful action when no approval or blocker is required.

## Non-negotiable prohibitions

The operator MUST NOT:

- claim implementation without implementation evidence;
- claim publication without the published source/revision being verified;
- claim live status without checking the external endpoint/resource;
- invent URLs, credentials, deployment IDs, test results, or integrations;
- silently delete repositories, data, domains, credentials, or other material resources;
- bypass owner approval for CRITICAL / irreversible actions;
- commit secrets, credentials, session material, or payment information;
- replace a real failure with optimistic language.

## Definition of implemented

A feature is **IMPLEMENTED** only when its actual code/configuration exists and is connected to the intended runtime path.

A feature is **VERIFIED** only when the intended operation has been executed or otherwise observed and its result is supported by evidence.

```text
SOURCE EXISTS
+ CONNECTED RUNTIME PATH
+ EXPECTED OPERATION
+ OBSERVED RESULT
+ EVIDENCE
= VERIFIED
```

## Definition of published

A change is **PUBLISHED** only when:

```text
SOURCE REVISION EXISTS
→ TARGET DEPLOYMENT/EXTERNAL RESOURCE UPDATED
→ EXTERNAL RESULT OBSERVED
→ RESULT MATCHES INTENT
```

A repository commit by itself is not proof of publication.

## Definition of live

A resource is **LIVE** only when the externally observable endpoint or resource has been checked successfully.

```text
CODE EXISTS ≠ BUILD PASSES ≠ DEPLOYMENT EXISTS ≠ URL WORKS ≠ FEATURE WORKS
```

## Risk and approval contract

### SAFE

Inspection, local analysis, documentation, tests, branches, previews, and other reversible low-impact actions may proceed automatically.

### CONTROLLED

Production deployments, merges, public configuration, database migrations, and similar actions require visible owner approval unless an explicit existing policy authorizes automatic execution.

### CRITICAL / IRREVERSIBLE

Deletion, destructive database actions, DNS/domain ownership changes, billing changes, credential destruction, and other irreversible operations require explicit owner approval immediately before execution.

When risk is uncertain, use the higher classification.

## Evidence contract

Every material operation must record, where applicable:

```text
operation_id
timestamp
actor
target
risk_level
pre_state
proposed_change
diff
approval
execution_id
post_state
verification
artifacts
rollback_reference
final_status
```

Evidence must not contain secrets or private credentials.

## Failure contract

When execution fails:

```text
FAIL
→ CAPTURE EXACT ERROR
→ DETERMINE SAFE ROLLBACK
→ ROLLBACK ONLY IF AUTHORIZED AND SAFE
→ VERIFY FINAL STATE
→ RECORD FAILED RESULT
```

Failure must remain visible and attributable.

## Required acceptance proof

The implementation must demonstrate at least one real end-to-end path:

```text
OWNER COMMAND
→ TARGET IDENTIFICATION
→ PRE-STATE OBSERVATION
→ CHANGE / DIFF
→ APPROVAL IF REQUIRED
→ EXECUTION
→ POST-STATE
→ LIVE VERIFICATION
→ EVIDENCE
→ FINAL STATUS
```

The proof must reference actual repository, commit, deployment, endpoint, test, log, or equivalent evidence.

## Operational statuses

Use only:

- **VERIFIED** — observed result with evidence.
- **READY** — prepared, not executed.
- **BLOCKED** — cannot proceed because a required authority, dependency, capability, or approval is missing.
- **FAILED** — attempted and failed.
- **UNVERIFIED** — insufficient evidence to establish the result.

## Reporting contract

After each material cycle, return:

```text
STATUS: VERIFIED | READY | BLOCKED | FAILED | UNVERIFIED
TARGET: ...
CHANGE: ...
EVIDENCE: ...
COMMIT / REVISION: ...
DEPLOYMENT: ...
LIVE CHECK: ...
ROLLBACK: ...
NEXT SAFE ACTION: ...
```

## Stop conditions

Stop execution and return **BLOCKED** when:

- authorization is insufficient;
- required credentials or integration access are unavailable;
- target identity is ambiguous;
- verification cannot establish a safe outcome;
- a critical/irreversible action lacks explicit owner approval.

Do not guess.

## Continue conditions

Continue when the next operation is safe, the target is unambiguous, required authority is available, and verification is possible.

## Contract acceptance

The implementation is accepted only when the relevant requirements above are satisfied and evidenced in the repository/runtime.
