# Brushworks reseller-first delivery model

## Product role

Brushworks is the commercial control layer for selling and delivering websites, domains, hosting, support, renewals, and related digital packages. It is not limited to being a visual site builder.

## Core route

```text
https://brushworks.a11-k.space/reseller
```

## Operating objects

- **Opportunity:** prospect, need, brief, source, and next action.
- **Domain:** requested name, extension, registration/transfer state, registrar, renewal date.
- **Hosting:** runtime, storage, database, backup, support level, provider, renewal date.
- **Site package:** template, pages, assets, copy, SEO state, acceptance state, export artifact.
- **Deployment:** provider, project, hostname, DNS record, HTTPS state, public response, release evidence.
- **Support:** issue, priority, owner, SLA target, provider handoff, resolution evidence.
- **Renewal:** asset, due date, cost, client status, reminder state, renewal evidence.

## Provider-neutral rules

1. Brushworks owns the workflow and evidence, not an unverified provider account.
2. Every provider integration is an adapter behind the same operational objects.
3. A client package must remain exportable where the selected provider allows it.
4. The production URL is recorded only after DNS, HTTPS, and HTTP response verification.
5. Costs and margin are kept in the private operational layer; public pages must not invent pricing.
6. Payments, DNS changes, registrations, transfers, and account mutations remain approval-gated.

## Provider fit

| Provider | Best deployment use | Brushworks relationship |
|---|---|---|
| Base44 | Managed full-stack app with built-in backend capabilities | Downstream app provider; Brushworks retains opportunity and fulfilment state |
| Lovable | Fast full-stack product with GitHub and Supabase path | Downstream build provider; Brushworks owns commercial handoff |
| v0/Vercel | Code-first sites, previews, Git, and production deployments | Preferred code-first deployment route where appropriate |
| Canva Websites | Simple marketing sites and visual publishing | Low-complexity fulfilment option |
| Figma Sites | Design-led responsive sites and collaborative iteration | Design-led fulfilment option |
| Brushworks | Reseller control, package, domain/hosting coordination, deployment evidence, support, renewals | Primary operating layer |

## Release URLs

- Main site: `https://brushworks.a11-k.space/`
- Reseller surface: `https://brushworks.a11-k.space/reseller`
- Comparison register: `/COMPARISON.md` locally; publish a public HTML equivalent before linking it externally.
- Deployment register: `/DEPLOYMENT.md` locally; keep operational details private unless sanitised.
- Semrush register: `/SEMRUSH_AUDIT.md` locally; use it as the audit gate, not as proof of a completed crawl.

## Immediate implementation boundary

The local reseller surface currently stores opportunities in `.brushworks/leads.json`. It does not send email, charge a customer, register a domain, alter DNS, create a hosting account, or claim a deployment. Those are later authenticated adapters.
