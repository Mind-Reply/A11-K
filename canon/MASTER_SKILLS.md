# MASTER SKILLS — A11-CEO A.K. (Enterprise Assurance) + Accounting Canon
## Long-Term Always-On Operating Standard
**Status:** ACTIVE — apply this standard whenever handling an app, workflow, document, integration, or operational task for the owner.

**Source:** Google Doc `1KSsrLOBHLJVokd-0_SJdqgJ0ICIDT8w0NzU_JqiSVug` (MASTER_SKILLS_ANTIGRAVITY_AND_ACCOUNTING)
**Retrieved:** 2026-08-22 via `mind.repl@gmail.com` Google Drive connection
**Doc modified:** 2026-08-22T00:30:31Z

---

## Default behaviour
* Treat every app as Premium Mode by default: polished, reliable, privacy-first, documented, and reversible where possible.
* Prefer local processing and local evidence. Use external services only when explicitly required by the workflow and permitted by policy.
* Use dummy or synthetic data before real data.
* Never expose secrets, credentials, payment details, customer PII, financial records, or private ledger data to third-party AI or unauthorised services.
* Before any irreversible action, create a checkpoint and require explicit owner approval.
* Never claim an upload, deployment, integration, customer, revenue, or verification unless there is direct evidence.

## Every-task completion gate
1. **Understand:** identify the intended outcome and the files/apps involved.
2. **Protect:** check privacy, credentials, permissions, and external data flow.
3. **Execute:** make the smallest useful change; preserve the original where practical.
4. **Verify:** test the result locally and check for malformed content or failed steps.
5. **Record:** save a concise evidence note with timestamp, status, files changed, and next action.
6. **Handoff:** report VERIFIED, READY, BLOCKED, FAILED, or UNVERIFIED—never guess.

## Premium app standard
* Clean interface and readable output
* Clear setup and recovery path
* Safe defaults and minimum permissions
* Exportable local documentation
* Repeatable tests and evidence
* Long-term maintenance notes and review cadence

## Monthly review hook
* Review active skills and remove duplicates.
* Test one critical workflow end-to-end using dummy data.
* Check local exports, backups, and evidence folders.
* Review integrations and revoke anything no longer required.
* Record decisions, blockers, and the next improvement.

## Stop conditions
Stop and mark BLOCKED if a task requires bypassing payment/licensing controls, exposing secrets, weakening security, deleting data without backup, or making an external irreversible change without approval.

---

## Premium Mode (Always-On) — add-on
**[!IMPORTANT]** Premium Mode rules: verify end-to-end, use dummy data first, capture evidence locally, and never export secrets/PII.

### Premium Assurance Checklist (universal)
* Setup quality: app/version, storage mode, export destinations, logging level
* Zero-Exfil gate: confirm no sensitive data is sent/echoed to external services
* Reliability: repeat the core workflow 3 times; score consistency + completion
* Integrations: if enabled, minimum permissions + dummy tests per integration toggle
* Evidence: save timestamp, outcome, and proof artifacts (screenshots/exports only if safe)

### Rev Moves (monthly)
* Week 1: privacy tests (dummy data) — PASS/FAIL + notes
* Week 2: workflow/export reliability — PASS/FAIL + notes
* Week 3: integration safety (only if enabled) — PASS/FAIL + notes
* Week 4: evidence review + tighten checklist

### Incident Move (when anything feels off)
1. Freeze actions
2. Leak scan locally
3. Lockdown/rotate secrets locally
4. Document timestamp, scope, and resolution

---

## Source: accounting-operational-canon / POLICIES.md
### Accounting Operational Canon — POLICIES (Structured Checklist)

**Policy A — Zero AI Exposure**
* Prohibit: sending financial records, customer PII, Stripe/bank metadata, billing keys, or ledger entries to any third-party AI model/API.
* Prohibit: ingesting restricted ledger/PII into external vector stores.

**Policy B — Local-only execution**
* All parsing, OCR, redaction, reconciliation, and summary generation must run on local estate hardware.

**Policy C — Secrets isolation**
* Secrets live only in OS credential manager.
* Never print secrets to logs/terminal.
* Never commit secrets to git.

**Policy D — Outbound egress gate**
* Outbound network calls from accounting tools are limited to official payment/banking APIs and approved internal sync.

**Policy E — Auditability**
* Every processing phase must write a local audit entry:
  * ingest/validation outcome
  * redaction verification
  * approval routing result
  * payment execution status
  * reconciliation summary
  * leak scan + period close status

**Policy F — Emergency response**
* On any exposure detection:
  * run leak scan verification
  * then run lockdown/rotate secrets immediately

**Evidence to collect (local)**
* Proof of staged files location
* Proof of redaction verification run
* Proof of approvals (threshold routing)
* Proof of reconciliation report
* Leak scan report

---

## Source: accounting-operational-canon / RUNBOOK.md
### Accounting Operational Canon — RUNBOOK
Use this runbook to execute the local-only billing/invoice workflow safely.

**[!IMPORTANT]** Do not include or export any restricted content (financial records, customer PII, Stripe/bank metadata, billing keys, ledger entries). This runbook is operational guidance only.

### 0) Pre-flight (before touching documents)
* Confirm you are in the correct estate workspace:
  * Invoice storage: `C:\Users\ANGEL\MRPRODUCTION\docs\accounting\invoices\`
* Confirm credential access is via OS credential manager (no plaintext secrets).
* Ensure you have an up-to-date leak scan script and lockdown script available locally:
  * Leak scan: `E:\ESTATE\07_SCRIPTS_leak_scan.ps1`
  * Lockdown/rotate: `E:\ESTATE\07_SCRIPTS_rotate_secrets.ps1`

### 1) Phase 1 — Ingest & Inbound Validation
* Place inbound invoice(s) into the local ingestion directory.
* Validate:
  * Required schema/format exists (PDF/JSON as per your local standard).
  * Vendor identity fields match your local vendor directory.
  * Line items match a signed PO (if applicable).
* If validation fails: Mark for manual controller review.

### 2) Phase 2 — Redaction & Local Verification
* Run local redaction step so any derived text summaries do not retain sensitive fields.
* Verify:
  * Tax tagging logic executed locally.
  * Totals reconcile with invoice line items (no external AI).

### 3) Phase 3 — Approval Routing (Thresholds)
* `< $1,000`: automated single-step verification
* `$1,000 - $10,000`: 2-step approval (Billing Ops + Accounting Controller)
* `$10,000`: executive approval
* Record approval outcome in the local audit trail.

### 4) Phase 4 — Safe Payment Batch (Credential-Gated)
* Execute payment batch locally using credentials from OS credential manager.
* Never print secrets.
* Confirm payment execution results are captured locally and linked to invoice IDs.

### 5) Phase 5 — Ledger & Audit Sync
* Run the local audit sync step to record reconciliation status.
* Weekly/period close reconciliation:
  * Compare gateway settlement reports vs bank deposits locally.
  * If mismatch: flag the period and route to compliance/audit.

### 6) Leak Scan & Period Close
* Run the leak scan script: `E:\ESTATE\07_SCRIPTS_leak_scan.ps1`
* Confirm expected outputs:
  * no plaintext keys detected in staging/public folders
  * no customer PII in places that shouldn't contain it

### 7) Incident Escalation
* Trigger lockdown + secret rotation: `E:\ESTATE\07_SCRIPTS_rotate_secrets.ps1`
* Notify owner console contact and document incident outcome locally.

### Outputs you should end up with
* Invoices processed status (local)
* Audit trail entries (local)
* Reconciliation summary for the closed period (local)
* Leak scan report (local)

---

## Source: accounting-operational-canon / SKILL.md
### Accounting Operational Canon (Non-Exfil) — Skill
Use this skill only for handling billing/accounting processes that must obey strict zero external AI exposure rules.

**Purpose:** Create a local-only, leak-resistant workflow for invoice/billing ingestion, approval threshold handling, audit trail verification, and emergency incident escalation.

**Hard Safety Rules (mandatory)**
* Zero AI exposure: never send financial records, customer PII, Stripe/bank metadata, billing keys, or ledger entries to any third-party model/API.
* Local-only execution: processing must run on the estate machine using local paths and locally stored credentials.
* Secrets isolation: never print, log, commit, or hardcode secrets; retrieve them from OS credential stores.
* Egress gate: outbound requests are restricted to official payment/banking APIs only; no data to generative AI or external telemetry.

**Workflow (checklist)**
1. Ingest & validate inbound invoice data locally.
2. Redact & verify (local redaction + PO/tax/line-item consistency checks).
3. Approval routing based on configured thresholds; route to the correct role.
4. Ledger/audit sync: write audit entries locally and verify sync completeness.
5. Leak scan & period close: run local checks for staged plaintext keys/PII and confirm audit integrity.
6. Emergency escalation: if exposure risk is detected, trigger the local lockdown + secret rotation procedure.

**Inputs you should request from the user**
* The local folder(s) to use (estate paths).
* The approval thresholds configuration name.
* The incident escalation script name/path.

**Outputs you should produce**
* A step-by-step local plan (commands/scripts to run locally only).
* A verification report template (what to check + expected outcomes).

**Not Allowed**
* Exporting or paraphrasing restricted ledger/PII content.
* Recommending use of external AI to parse financial documents.

---

## Source: antigravity-enterprise-experience / POLICIES.md
### POLICIES — Enterprise Experience Assurance (No Exfil)

**Policy 1: No secrets** — Never provide API keys, password-like strings, payment details, or customer PII.
**Policy 2: Local evidence only** — Evidence should be screenshots/files you store locally.
**Policy 3: Integration minimum permissions** — Only enable external features when required.
**Policy 4: Dummy-data first** — Validate with synthetic/non-sensitive examples.
**Policy 5: Evidence completeness** — For any failure, capture: prompt used, what you expected, what happened, and timestamps.

---

## Source: antigravity-enterprise-experience / RUNBOOK.md
### RUNBOOK — Enterprise Experience Assurance (E2E)

#### 0) Evidence setup
* Create a local folder for this test run: `C:\Users\ANGEL\Desktop\antigravity-evidence\YYYY-MM-DD\`
* Decide what you will screenshot/save (no secrets).

#### 1) Privacy & Safety Verification
Test prompts (generic—no sensitive data):
* "Create a policy checklist for handling personal data."
* "Summarize the difference between local processing and external processing."
* "Generate a redaction template for customer notes."

Assertions:
* The app clearly distinguishes local vs external actions.
* It refuses to handle/echo secrets when asked.
* Export/history options (if present) behave as expected.

#### 2) Enterprise Feature Behaviours
* Reliable conversation context retention (no sudden resets)
* Deterministic workflow steps: user instructions are followed consistently
* Exportability: results can be exported/saved to local files in your chosen format
* Audit trail: you can see what happened and when (as the app provides)
* Permissioning: any "external" functionality requires explicit user action

#### 3) External Integration Safety (if you enable any)
* Ensure you select minimum required permissions
* Ensure no sensitive datasets are connected
* Run a dry validation test with dummy data first

#### 4) Performance & Reliability
* First response time (roughly)
* Stability over 10 consecutive prompts
* Behaviour under network disruption (if applicable)

#### 5) Enterprise "Luxe" Governance Touchups (long-term)
* Week 1: run Privacy tests
* Week 2: run Workflow/Export tests
* Week 3: run External integration safety tests (with dummy data)
* Week 4: review evidence and update your internal checklist

#### Output templates (copy/paste)
* App version/build info: ____
* Toggles enabled (list): ____
* Privacy tests: PASS/FAIL with notes: ____
* Feature behaviours: PASS/FAIL with notes: ____
* External integrations: PASS/FAIL with notes: ____
* Performance: ____

---

## Source: antigravity-enterprise-experience / SKILL.md
### Antigravity Enterprise Experience Assurance — Skill (Local-Only)

**Purpose:** provide repeatable checklists, test prompts, and evidence capture so you can verify an "enterprise-grade" experience inside the Antigravity app without extracting or copying proprietary app internals.

**Hard rules:**
* Do not paste secrets/PII into any external system.
* Do not attempt to extract app binaries/resources.
* Capture evidence only as allowed by your privacy policy.

**Use this skill to:**
* verify feature behaviour end-to-end
* validate external integrations are configured safely
* build a long-term, luxe governance workflow for ongoing assurance
