# Revenue Autonomy Canon

## Objective

Every action that can create, protect, measure, deliver, reconcile, or settle income must remain operational when no model is available.

This is a system property, not a prompt preference.

## Core rule

**Models may improve revenue operations; they may not be the revenue operation's single point of failure.**

The execution path is:

`signal → rule → action → evidence → state → ledger → settlement`

A model can sit beside that path for drafting, research, summarisation, or creative variation. It cannot be required to calculate money, authorise payment, determine entitlement, post a ledger entry, reconcile a transaction, or declare a settlement.

## Revenue actions covered

1. Offer discovery and catalogue loading.
2. Lead capture and source attribution.
3. Qualification using explicit rules and available facts.
4. Offer/package selection from versioned catalogue data.
5. Price, tax, discount, margin, commission and fee calculation.
6. Quote and checkout generation.
7. Order and payment state transitions.
8. Entitlement and delivery state transitions.
9. Evidence collection and acceptance gates.
10. Settlement calculation and ledger posting.
11. Refund, renewal and retention rules.
12. Reconciliation and exception queues.
13. Revenue, margin, conversion and settlement reporting.
14. Audit trail and replay.

## Deterministic data contract

Each money-bearing action must be reproducible from recorded inputs. At minimum record:

- `action_id`
- `occurred_at`
- `offer_id`
- `offer_version`
- `currency`
- `quantity`
- `unit_price`
- `discount`
- `tax`
- `fees`
- `gross_amount`
- `net_amount`
- `margin_amount` when applicable
- `state_before`
- `state_after`
- `evidence_reference`
- `actor_type`
- `approval_reference` when required

Never derive a financial value from free-form model output.

## Model-optional operating modes

### Mode A — No model

The complete revenue loop still works using catalogue data, rules, provider responses, timestamps and evidence.

### Mode B — Model-assisted

A model may propose text, classifications or research. The deterministic layer validates and executes the result.

### Mode C — Human override

An authorised owner/operator can override a rule where policy permits. The override is recorded with reason and evidence.

## Fail-closed gates

Block the money action when:

- price or currency is missing;
- the offer version is unknown;
- payment state is not authoritative;
- required evidence is absent;
- settlement inputs do not reconcile;
- an entitlement would be granted without an authorised paid/comped state;
- an external communication would violate the approval policy;
- a secret, customer PII, or restricted ledger data would enter public evidence.

## Event and content revenue

The Event & Content OS follows the same rule. Event creation, registration state, sponsorship/package pricing, content production status, rights gates, attendance evidence, deliverable acceptance, invoicing state, settlement and renewal must all be executable without a model.

Models can accelerate content variants and research. They are not the source of truth for event status, commercial terms, acceptance or settlement.

## Verification standard

A feature is not marked revenue-ready because a page renders. It is revenue-ready only when the underlying deterministic path can be tested end-to-end with synthetic data and produces reproducible evidence.

## Production boundary

This canon does not authorise production deployment, payment mutations, external outreach, contracts, DNS changes or irreversible actions. Those remain separately gated by owner approval.
