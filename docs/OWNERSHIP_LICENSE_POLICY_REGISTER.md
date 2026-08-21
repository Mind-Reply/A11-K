# Ownership, Licenses & Policy Register

Status: controlled operational register
Authority: CEO / owner approval required for consequential legal, licensing, ownership, transfer, publication or revenue decisions.

## Rules
- Never invent ownership, registration, certificate, license, consent, accreditation, trademark or contractual status.
- Store evidence references and expiry/review dates, not unnecessary secrets or identity documents.
- Certificates and private legal records remain private; public repos contain metadata/checksums/references only where appropriate.
- Any uncertain legal status is `UNKNOWN` and blocks publication or monetization that depends on the claim.
- Licenses must be compatible with intended distribution before code/assets are commercialized.
- Third-party assets require provenance and permitted-use evidence.
- Revenue use is allowed only when rights, terms, privacy, consumer, tax and platform requirements have been checked for the relevant jurisdiction.
- Preserve prior versions and an audit trail before material changes.

## Required record fields
`asset_id | product | asset_type | owner_status | license | provenance | jurisdiction | evidence_ref | expiry/review | commercial_use | restrictions | last_checked | next_check | decision | approver`

## Decision states
`CLEAR` — evidence supports intended use.
`REVIEW` — evidence incomplete but no action taken.
`RESTRICT` — use limited until condition is satisfied.
`BLOCKED` — do not publish, transfer, sell, or claim status.
`EXPIRED` — renewal/revalidation required.
`UNKNOWN` — stop and request authoritative evidence.

## Hourly monitor
The monitor may check metadata, repository policy files, known expiry/review dates, deployment configuration, dependency/license signals, public claims and evidence freshness. It must not silently alter legal records, certificates, ownership data or contractual terms.

## Escalation
Consequential legal, ownership, licensing, privacy, regulated-service, payment, tax or rights decisions require CEO/authorized human approval. Automation may collect evidence, flag risk, prepare a proposed action, preserve a backup and verify a completed approved action.

## Revenue protection
Before a monetized launch or material campaign change, verify: ownership/right to use, software/data/content licenses, trademark/brand constraints, privacy/consent basis, platform terms, payment restrictions, required disclosures and applicable local requirements. Keep evidence attached to the decision record.
