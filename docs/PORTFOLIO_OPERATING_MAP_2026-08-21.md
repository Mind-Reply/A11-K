# Portfolio Operating Map — 2026-08-21

Purpose: one evidence-led operating map for the owner's portfolio. This file is a control manifest, not a legal ownership assertion.

## Priority products

| Product | Source | Role | Canonical direction | Trial team |
|---|---|---|---|---|
| MindReply | Mind-Reply/mindreply | flagship commercial product | mind-reply.com / app.mind-reply.com | Architect + Builder + Breaker |
| A11-K | Mind-Reply/A11-K | decision/recovery operating layer | a11-k.space | Architect + Builder + Breaker |
| ResellerPro | angellllkr-eng/resellerpro-platform + reseller-pro-enterprise + registrar-control-plane | commerce/domain platform | resellerpro.com | Architect + Builder + Breaker |
| Radar | angellllkr-eng/enterprise-engine-radar + opportunity-radar | opportunity intelligence | radar.mind-reply.com | Architect + Builder + Breaker |
| WhatsApp Router | Mind-Reply/whatsapp-ai-router | communications routing | whatsapp.mind-reply.com | Architect + Builder + Breaker |
| AUREL | Mind-Reply/Aurel + archived public/brand repos | premium brand/product | aurel canonical domain | Architect + Builder + Breaker |
| Brushworks | angellllkr-eng/brushworks | creative commerce | brushworks canonical domain | Architect + Builder + Breaker |
| OpenMontage | angellllkr-eng/openmontage + source mirror | creative/product surface | canonical OpenMontage domain | Architect + Builder + Breaker |
| Pointer | angellllkr-eng/pointer-ai-landing-page | focused acquisition/product | pointer canonical domain | Architect + Builder + Breaker |
| Control Plane | angellllkr-eng/agent-control-plane + Mind-Reply/mind-reply-control + related private repos | private owner operations | control.mind-reply.com | Architect + Builder + Breaker |

## Decision states

`DEPLOY` = product is sufficiently coherent for a production path after checks.
`MERGE` = useful work exists but multiple repos/surfaces should become one canonical product.
`PRIVATE` = operational, legal, credential, orchestration or sensitive infrastructure.
`ARCHIVE` = historical/template/duplicate material; preserve history before removal.
`UNKNOWN` = evidence insufficient; do not publish or monetize dependent claims.

## Universal execution loop

1. Snapshot/backup before material change.
2. Inspect current production and repository evidence.
3. Architect proposes the highest-leverage route, including at least one uncommon alternative.
4. Builder implements the smallest complete useful slice.
5. Breaker attacks functionality, UX, security, performance and recovery.
6. Decision engine scores evidence, blast radius and reversibility.
7. Preview/test before production.
8. Deploy only when gates pass.
9. Independently verify the public result.
10. Roll back or apply the safest fallback when verification fails.
11. Record the decision, evidence and outcome.

## Hard gates

- Unknown ownership/licensing/provenance blocks dependent publication or monetization.
- Secrets and private legal records never enter public repositories.
- Production changes require a verified backup/recovery route.
- Consequential ownership, legal, payment, tax, identity, DNS or rights decisions require the owner/authorized human gate.
- No infinite retry loops; repeated failure becomes a latched incident.

## Hourly objectives

- Detect broken production surfaces and deployment drift.
- Check evidence freshness and governance posture.
- Check obvious secret leakage signals.
- Compare intended canonical URL mapping against observed deployment state.
- Re-evaluate unresolved incidents and fallback readiness.
- Produce a traceable decision posture; do not silently mutate sensitive records.
