# A11K Sovereign Execution Plane (SEP)

Status: ARCHITECTURE BASELINE — 2026-09-12
Owner: CEO A.K.
Canonical product/estate name: A11K
Public domain expression: A11-K Space (`a11-k.space`)

## 1. Executive decision

A11K should not be built as another chatbot, generic agent framework, or multi-tenant SaaS admin panel. It should be built as a private owner-controlled execution plane that sits between probabilistic intelligence and consequential systems.

The defining boundary is:

`OWNER AUTHORITY -> POLICY -> INTENT -> AGENT REASONING -> CAPABILITY LEASE -> EXECUTION -> VERIFICATION -> EVIDENCE`

Models may propose. Agents may plan. Tools may execute. The execution plane decides whether an action is authorized, within scope, reversible enough, and evidenced.

Core operating loop:

`UNDERSTAND -> PROTECT -> EXECUTE -> VERIFY -> RECORD -> HANDOFF -> CONTINUE`

The atomic operational object is an **Action Transaction**. Every consequential action receives an immutable intent, actor identity, policy decision, capability scope, execution result, verification result, evidence references, and recovery state.

## 2. Signature architecture

### Name

**A11K Sovereign Execution Plane (SEP)**

### Distinctive idea

**Capability leases + evidence-bound execution.**

An agent never receives a permanent "power" such as `deploy`, `purchase`, or `delete`. It receives a narrowly scoped, short-lived capability lease for a specific intent, resource set, environment, budget and time window. The executor must return evidence before the transaction is considered complete.

This creates a hard separation:

- Intelligence plane: models, planners, specialist agents, research and memory.
- Authority plane: owner identity, policy, approvals, capability leases and kill switch.
- Execution plane: isolated workers, APIs, browser sessions, CI/CD and infrastructure tools.
- Evidence plane: append-only audit events, artifacts, hashes, receipts and verification results.

The model provider is replaceable because providers never own the authority boundary.

## 3. Control-plane surfaces

Private owner routes:

`/admin /chat /projects /repos /agents /workflows /automations /deployments /infrastructure /domains /sites /procurement /shopping /tasks /research /memory /evidence /logs /security /settings`

Executive cockpit must answer in one screen:

1. What is live?
2. What failed?
3. What changed?
4. What needs owner approval?
5. What is costing money?
6. What is being built?
7. What is the next safest high-value action?

Engineering mode exposes deployments, CI runs, logs, traces, agent/tool calls, policy decisions, infrastructure state and evidence chains.

## 4. Authority model

There is one human principal: the owner.

### Identity

- WebAuthn/passkey as primary authentication.
- Recovery path protected separately and never exposed to agents.
- Short-lived sessions with secure, HttpOnly, SameSite cookies.
- Device/session registry with revocation.
- Step-up authentication for financial, destructive, security and credential actions.
- No public registration.
- No anonymous administration.

### Policy outcomes

Every action resolves to one of:

- `ALLOW_AUTONOMOUS` — low-risk, reversible and within a standing policy.
- `REQUIRE_APPROVAL` — consequential action paused in the owner approval queue.
- `DENY` — outside policy or insufficient evidence.
- `EMERGENCY_STOP` — execution globally or selectively suspended.

Agent-generated text can never override the policy engine.

## 5. Agent hierarchy

`OWNER`
`  -> EXECUTIVE ORCHESTRATOR`
`     -> DOMAIN OFFICERS`
`        -> SPECIALIST AGENTS`
`           -> CAPABILITY BROKER`
`              -> ISOLATED EXECUTORS`
`                 -> TOOLS / APIS / INFRASTRUCTURE`

### Initial officers

| Agent | Can access | Cannot access |
|---|---|---|
| Executive Orchestrator | project state, task graph, approved tools | raw secrets, unrestricted payments |
| Engineering Officer | repos, CI, test/build/deploy APIs | payment credentials, owner recovery secrets |
| Security Officer | security telemetry, dependency data, policy state | silently changing its own policies |
| Research Officer | web/search/research sources | financial execution |
| Deployment Officer | CI/CD, preview/prod deploy capability leases | permanent production credentials |
| Infrastructure Officer | approved infrastructure APIs | unrestricted account administration |
| Procurement Officer | vendors, products, prices, budgets, purchase requests | payment credentials, autonomous spending |
| Shopping Agent | product discovery/comparison and cart preparation | checkout authorization |
| Marketing Officer | approved brand assets, content systems, analytics | financial or legal commitments |
| Documentation Officer | repositories, evidence, reports | production secrets |
| Monitoring Officer | telemetry, alerts, recovery playbooks | destructive recovery outside policy |

Agents communicate through typed task/event envelopes, not unrestricted natural-language trust.

## 6. Capability leases

A lease contains at minimum:

- `lease_id`
- `actor_id`
- `intent_id`
- `capability`
- `resource_scope`
- `environment`
- `constraints`
- `budget_limit`
- `expires_at`
- `approval_id` when required
- `policy_version`
- `issued_at`
- `revoked_at`

Examples:

`deploy:preview repo=Mind-Reply/A11-K ttl=15m`

`purchase:prepare vendor=X max_total=500 EUR ttl=10m`

`infra:restart service=foo environment=staging ttl=5m`

A lease is useless outside its exact scope and cannot mint another lease.

## 7. Procurement and shopping

Procurement is a separate bounded subsystem.

Lifecycle:

`RESEARCH -> RECOMMEND -> PREPARE -> REQUEST_APPROVAL -> PURCHASE -> VERIFY`

`PURCHASE_REQUEST` fields:

- item
- vendor
- SKU/product identity where available
- quantity
- unit price
- total
- currency
- shipping/tax estimate
- reason
- alternatives
- compatibility evidence
- warranty/return information
- expiration
- owner approval status
- execution evidence

The AI never receives card numbers, bank credentials or unrestricted checkout credentials.

The normal execution path is owner-authenticated checkout handoff. A narrowly scoped merchant integration may place an order only when the owner has explicitly enabled that merchant/action class and the purchase request has a matching approval and spending ceiling.

Verification requires independent confirmation of order ID, vendor, amount, currency, items and delivery estimate. No confirmation means `UNVERIFIED`, never `PURCHASED`.

## 8. Automation classes

### Deployment
Trigger: code change / approved release.
Inputs: commit, repo, environment, policy.
Permissions: test/build first; production lease only after gates.
Flow: test -> security scan -> build -> preview -> smoke test -> approval policy -> production -> health check -> evidence.
Failure: stop promotion, retain logs/artifacts, rollback where safe, notify owner.

### Monitoring
Trigger: health/metric/event failure.
Permissions: read -> classify -> approved recovery playbook.
Flow: detect -> classify -> safe recovery -> verify -> notify -> record.
Never permit an agent to expand its own recovery authority.

### Research
Trigger: owner request or scheduled research.
Flow: collect -> compare -> source/evidence -> confidence -> recommendation -> owner review.

### Procurement
Trigger: explicit need or approved recurring requirement.
Flow: discover -> compare -> budget -> approval -> purchase -> verify -> receipt record.

### Shopping
Trigger: owner request.
Flow: discover -> normalize specs -> compare total cost -> shortlist -> approval -> cart preparation -> owner checkout.

### Reporting
Trigger: schedule/event.
Flow: collect -> analyze -> produce -> evidence-link -> deliver.

### Security
Trigger: suspicious event.
Flow: detect -> contain -> record -> investigate -> recover -> verify -> notify.

### Maintenance
Trigger: schedule/drift.
Flow: inspect -> classify -> safe repair -> verify -> record.

## 9. Human/AI boundary

### Autonomous
1. Run tests.
2. Format/lint code.
3. Generate preview deployments.
4. Run non-destructive health checks.
5. Rotate temporary worker leases.
6. Summarize logs.
7. Index approved documentation.
8. Compare product specifications.
9. Monitor public prices.
10. Draft reports.
11. Create reversible internal tasks.
12. Restart an approved staging worker.
13. Archive generated artifacts according to policy.
14. Detect configuration drift.
15. Prepare purchase carts without checkout.

### Approval required
1. Production deployment outside pre-approved release policy.
2. Production rollback with material impact.
3. Database destructive migration.
4. Domain/DNS change.
5. External customer communication with material consequence.
6. Legal/compliance submission.
7. Financial transaction.
8. Purchase order.
9. New vendor authorization.
10. Credential creation or privilege expansion.
11. Cloud account or billing change.
12. Security policy modification.
13. Data deletion.
14. Public release of sensitive research.
15. New agent with access to consequential tools.

### Forbidden
1. Exfiltrate secrets.
2. Reveal private credentials to a model.
3. Disable audit logging to complete an action.
4. Bypass owner approval by changing policy.
5. Mint unrestricted capability leases.
6. Impersonate the owner.
7. Create anonymous administrative access.
8. Purchase without a valid authorization.
9. Delete evidence to hide an action.
10. Circumvent platform security controls.

## 10. Security architecture

Assume prompt injection, malicious webpages, stolen sessions, compromised extensions, hostile dependencies, malicious MCP/tool servers, credential theft and runaway agents.

Controls:

- zero-trust service-to-service authorization
- WebAuthn/passkeys and step-up authentication
- short-lived capability leases
- isolated execution workers
- secrets held only by secret managers/executors
- no secret values in model context
- CSP and strict origin policy
- browser extension minimum permissions
- dependency lockfiles, provenance/SBOM and vulnerability scanning
- signed/verified deployment artifacts where practical
- rate limits and budget ceilings
- circuit breakers and global kill switch
- append-only audit events
- encrypted data at rest and TLS in transit
- backup + restore testing
- separate production credentials from development
- immutable evidence retention policy
- emergency owner-only revocation path

Prompt injection is treated as untrusted data. Page text, email content, repository content and tool responses cannot grant authority.

## 11. Browser architecture

Use a Manifest V3 TypeScript extension built with WXT.

Permissions should be narrowly scoped. The extension sends selected page context to the control plane; it does not expose long-lived owner credentials to content scripts.

Rules:

- content scripts are untrusted
- page content is data, never policy
- privileged actions happen through the control-plane origin
- OAuth/session tokens are never embedded in page DOM
- cross-origin requests are allowlisted
- sensitive actions require owner step-up
- extension can be remotely revoked

## 12. Mobile architecture

Use React Native/Expo for the owner command surface.

Initial screens: status, chat, approvals, tasks, deployments, security, procurement and emergency stop.

The phone is an authority surface, not merely a read-only dashboard. High-impact actions require passkey/biometric step-up and display exact action, scope, target, cost and evidence state before confirmation.

## 13. Engineering/deployment pipeline

`Git -> CI -> unit/type/security tests -> build -> artifact -> preview -> smoke -> policy gate -> production -> health -> evidence`

Recommended branch model:

- `main`: protected production source.
- short-lived feature branches.
- preview environment per pull request.
- production promotion only from verified commit/artifact.
- rollback to last known-good immutable artifact.

Every deployment record stores commit SHA, build artifact identity, environment, actor, policy decision, start/end, health checks and rollback state.

## 14. Data architecture

Core PostgreSQL entities:

`owner_identity`
`devices`
`sessions`
`projects`
`repositories`
`agents`
`capabilities`
`capability_leases`
`policies`
`tasks`
`workflows`
`automation_runs`
`deployments`
`infrastructure_resources`
`domains`
`sites`
`research_items`
`memories`
`decisions`
`evidence`
`audit_events`
`purchase_requests`
`purchases`
`vendors`
`products`
`approvals`
`incidents`

Separate stores/logical domains:

- operational state: PostgreSQL
- secrets: dedicated secret manager
- memory: PostgreSQL + pgvector initially
- evidence/artifacts: object storage with hashes
- audit: append-only event stream/table plus periodic integrity anchors
- financial records: restricted schema and access policy

Do not put secrets, payment credentials or raw recovery material into memory/vector storage.

## 15. Intelligence layer

Use a provider-neutral AI gateway. Model adapters implement a stable internal contract:

`chat / structured_output / tool_call / embedding / vision / reasoning_profile`

Routing factors:

- task class
- quality requirement
- latency target
- cost ceiling
- context size
- reliability score
- privacy/data class
- availability

A model can be replaced without changing agent permissions or execution code.

Memory tiers:

1. Working context — task-local.
2. Project memory — scoped to project.
3. Owner memory — explicitly approved durable preferences/decisions.
4. Evidence — immutable facts/artifacts, never rewritten as "memory".

## 16. Technology decisions

| Layer | Default | Why | Why not obvious alternative |
|---|---|---|---|
| Web | Next.js + TypeScript | fast owner cockpit, mature routing, server/client boundaries | plain SPA adds unnecessary auth/data plumbing |
| API | FastAPI + Python | strong automation/AI/integration ecosystem | Node-only backend is less convenient for research/ML tooling |
| DB | PostgreSQL | durable relational core, transactions, mature ecosystem | document DB weakens approval/audit invariants |
| Vector | pgvector | keeps initial memory simple and transactional | separate vector DB adds operational surface too early |
| Auth | WebAuthn/passkeys + server session layer | owner-grade phishing resistance and control | generic password auth is weaker |
| AI gateway | internal adapter layer, optionally LiteLLM-compatible | provider portability and routing | binding agents directly to one model vendor creates lock-in |
| Agent runtime | Python workers + durable workflow contracts; Temporal when long-running scale requires it | explicit state/retries and Python ecosystem | pure prompt-chain frameworks do not provide sufficient authority boundary |
| Workflow | n8n for portable business automation; A11K policy engine remains authoritative | fast integrations and visual workflows | n8n alone should not become the security boundary |
| Browser | WXT + TypeScript, Manifest V3 | extension ergonomics and modern build | custom browser fork is excessive initially |
| Mobile | React Native + Expo | one owner mobile codebase | native iOS/Android doubles initial surface |
| CI/CD | GitHub Actions | existing estate integration and broad ecosystem | bespoke CI wastes effort |
| Deployment | Vercel for web; Render/container platform for API initially; portable Docker | matches existing estate and keeps migration possible | Kubernetes too early increases operational burden |
| Observability | OpenTelemetry + Grafana/managed backend | vendor-neutral traces/metrics/logs | provider-specific telemetry creates lock-in |
| Secrets | cloud secret manager / Vault later | secrets stay outside model and DB | `.env` files are not an authority boundary |
| Object storage | S3-compatible | evidence/artifact portability | vendor-specific blob APIs add migration friction |
| Queue | Postgres queue initially; Redis/NATS when scale requires | minimum moving parts | Kafka is excessive before event volume justifies it |
| Search | PostgreSQL FTS + pgvector | unified initial stack | Elasticsearch/OpenSearch adds ops cost too early |

Kubernetes becomes a later execution substrate, not the first product feature. The control plane must remain portable across it.

## 17. Failure model

| Failure | Detection | Immediate containment | Recovery/prevention |
|---|---|---|---|
| Compromised agent | anomalous tool/capability use | revoke leases | isolate worker, rotate credentials |
| Prompt injection | policy mismatch / hostile content markers | ignore injected authority | sandbox untrusted context |
| Stolen session | device/risk anomaly | revoke session | passkey re-auth, device review |
| Production deletion | destructive event alert | freeze actor | restore tested backup, approval gate |
| Incorrect purchase | order verification mismatch | stop further orders | cancel/return if possible, tighten policy |
| Runaway automation | rate/budget circuit breaker | disable workflow | replay from last safe state |
| Model hallucination | evidence/verification failure | mark UNVERIFIED | require source-backed execution |
| Corrupted memory | integrity/version anomaly | quarantine memory set | restore previous snapshot |
| Bad deployment | health/smoke failure | stop promotion | rollback known-good artifact |
| Compromised dependency | SBOM/scanner/advisory | block release | pin/replace dependency |
| API credential leak | secret scanning/anomaly | revoke credential | rotate and scope lease |
| Vendor outage | health checks | route/fallback | retry with backoff or alternate provider |
| Database corruption | integrity/restore test | stop writes where necessary | point-in-time restore |
| DNS hijack | certificate/DNS monitoring | disable affected route | restore authoritative records |
| Malicious tool server | behavior/policy anomaly | revoke tool capability | quarantine and review |
| Agent privilege escalation | lease/policy mismatch | deny request | inspect policy and worker identity |
| Evidence deletion attempt | append-only mismatch | isolate actor | recover immutable evidence |
| Cost explosion | spend telemetry | hard budget cutoff | route to cheaper models / require approval |
| Browser extension compromise | signature/version anomaly | revoke extension access | publish clean build |
| Owner device loss | device registry event | revoke device | enroll replacement with passkey |

## 18. Continuous operating loop

Every event:

`DETECT -> CLASSIFY -> DECIDE -> EXECUTE -> VERIFY -> RECORD`

Every schedule:

`INSPECT -> PRIORITIZE -> SAFE WORK -> VERIFY -> REPORT`

Every deployment:

`BUILD -> TEST -> DEPLOY -> HEALTH -> EVIDENCE`

Every purchase:

`RESEARCH -> RECOMMEND -> APPROVE -> PURCHASE -> VERIFY`

Every security incident:

`DETECT -> CONTAIN -> INVESTIGATE -> RECOVER -> RECORD`

## 19. 0–30 days: smallest serious system

Deliver:

1. Private owner web cockpit.
2. Passkey authentication and device/session revocation.
3. PostgreSQL operational schema.
4. Policy engine with ALLOW/APPROVAL/DENY/STOP.
5. Action Transaction + evidence record.
6. Repo/CI read integration.
7. Preview deployment workflow.
8. Basic monitoring and owner alerts.
9. Procurement research + approval objects; no autonomous checkout.
10. Emergency kill switch.

Acceptance:

- no public registration
- no anonymous admin route
- every tool action has actor + policy result
- secrets absent from model context and logs
- failed deployment produces evidence and no false success
- purchase request cannot execute without approval
- restore procedure tested

Do not build yet: Kubernetes platform, complex multi-agent marketplace, autonomous purchasing, custom model training, full ERP, multi-tenant billing.

## 20. 30–90 days: integrated owner control plane

Deliver:

- domain/project/repo/deployment registry
- agent registry and capability leases
- workflow runner
- n8n integration as non-authoritative automation layer
- browser extension
- mobile owner app
- research/evidence pipeline
- memory tiers
- OpenTelemetry tracing
- incident console
- price monitoring and shopping comparison

Acceptance:

- owner can trace an action from intent to evidence
- revoke an agent/device within minutes
- recover a failed deployment from known-good artifact
- prepare but not silently purchase goods
- replace an AI model without changing agent policy

## 21. 3–12 months: autonomous operating platform

Deliver:

- durable agent scheduler
- specialist officer fleet
- event bus/queue
- advanced recovery playbooks
- infrastructure adapters
- vendor/procurement adapters
- richer financial controls
- evidence integrity anchoring
- policy simulation environment
- continuous security evaluation

Acceptance:

- safe recurring operations execute without owner intervention
- consequential operations consistently pause for approval
- agent authority remains bounded under retries/delegation
- operational state is recoverable and replayable

## 22. 1–3 years: expandable architecture

Add only when justified by real workload:

- Kubernetes execution fabric
- local/private model clusters
- multimodal and robotics adapters
- edge execution
- agent-to-agent federation
- hardware-backed workload identity/attestation
- advanced procurement APIs
- autonomous software engineering sandboxes
- cross-provider policy federation

The stable contract remains the A11K Action Transaction + capability lease + evidence chain.

## 23. Economics and cost controls

Primary cost classes:

- compute/API inference
- database/storage
- workflow execution
- observability
- domains
- browser/mobile distribution
- external research/data providers
- procurement transaction fees

Controls:

- per-agent monthly budget
- per-run token/cost ceiling
- model routing by task value
- hard stop on budget exhaustion
- approval threshold for expensive reasoning
- duplicate-work suppression
- exponential backoff
- cache research/results with expiry
- cost-per-success telemetry
- separate development and production budgets

The system should optimize for **verified value per unit cost**, not raw model usage.

## 24. Autonomy score — target architecture

| Dimension | Score |
|---|---:|
| Security | 9/10 |
| Intelligence | 9/10 |
| Autonomy | 9/10 |
| Engineering capability | 9/10 |
| Automation | 9/10 |
| Procurement | 8/10 |
| Reliability | 9/10 |
| Scalability | 8/10 initially; 10/10 after execution fabric maturation |
| Privacy | 9/10 |
| Future-proofing | 10/10 |
| Business usefulness | 9/10 |
| Overall | 9/10 target architecture |

Three biggest weaknesses:

1. The owner remains a necessary bottleneck for high-consequence actions; this is intentional, but limits throughput.
2. Evidence and verification are only as strong as the independent checks behind them.
3. Full multi-provider/multi-environment portability takes engineering effort and should not be mistaken for a day-one feature.

## 25. Competitive position

Potential advantages:

- Compared with conventional SaaS: one owner authority model and action/evidence semantics can be much more tightly integrated.
- Compared with generic assistants: execution is governed outside the model, with durable verification and rollback concepts.
- Compared with agent frameworks: the differentiator is the authority/evidence boundary, not orchestration syntax.
- Compared with workflow tools: workflows become workers underneath policy rather than the final authority.
- Compared with enterprise control planes: A11K can optimize for one owner's complete operational context rather than generic multi-tenant administration.
- Compared with developer platforms: the scope includes business, procurement, security and operations as one execution graph.

It will not automatically outperform hyperscale cloud platforms, mature procurement suites, enterprise IAM products, or general-purpose workflow vendors on breadth, reliability at enormous scale, or connector count. A11K should integrate with those systems rather than recreate them.

## 26. First ten automations

1. CI test/build on every relevant commit.
2. Preview deployment + smoke verification.
3. Production health monitoring.
4. Failed deployment classification and safe rollback proposal.
5. Security/dependency scan reporting.
6. Daily estate state report.
7. Research request -> evidence-backed brief.
8. Product price/availability monitor.
9. Purchase request -> approval queue.
10. Credential/session/security anomaly alerting.

## 27. First five procurement capabilities

1. Product discovery and normalized specification comparison.
2. Vendor reliability/price/availability comparison.
3. Owner budget and purchase-request ledger.
4. Cart preparation with explicit approval gate.
5. Post-order verification and receipt/evidence capture.

## 28. Build now / defer / never automate

### BUILD NOW

1. Owner authentication + policy engine.
2. Action Transaction/evidence ledger.
3. Engineering/deployment control surface.
4. Agent/capability registry.
5. Procurement research/approval subsystem.

### DEFER

1. Kubernetes-first infrastructure.
2. Fully autonomous purchasing.
3. Custom foundation-model training.
4. Public agent marketplace.
5. Large multi-tenant billing platform.

### NEVER AUTOMATE

1. Unbounded financial commitment.
2. Credential/recovery-secret disclosure.
3. Owner impersonation.
4. Audit/evidence suppression.
5. Security-policy bypass or self-granted authority.

## 29. Final foundation

**A11K Sovereign Execution Plane is a private owner operating layer in which models supply intelligence, agents supply planning, capability leases supply bounded authority, isolated workers supply execution, and an evidence ledger supplies proof.**

The company should therefore be designed as an **intent-to-evidence system**, not a chatbot with buttons.

The most important engineering invariant is:

> No model output becomes a consequential real-world action without passing through identity, policy, bounded capability, execution and verification.

The most important product invariant is:

> The owner can always see what the system intends to do, why it is allowed, what it actually did, what proves it, and how to stop or recover it.
