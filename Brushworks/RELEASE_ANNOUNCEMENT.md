# Brushworks reseller release model

## Public announcement position

> Brushworks is a high-end reseller and digital delivery operating layer: domains, hosting, cloud/server routes, website packages, deployment, support, renewals, and premium operational add-ons — with the builder wired into the workflow rather than sold as an isolated toy.

## Product stack

| Layer | Role | Primary system |
|---|---|---|
| Reseller control | Opportunities, packages, provider choice, deployment states, support, renewals | Brushworks |
| Builder | Brief-to-site, pages, blocks, previews, package export | Brushworks builder |
| Microtools | Small operational tools attached to a client/project workflow | Brushworks + connected services |
| Customer conversations | Service chats, support triage, reply handling, follow-up | MindReply |
| Premium connectivity | High-trust integrations, premium infrastructure, executive operations | Aurel optionality |
| Cloud/server delivery | Hosting, runtime, databases, storage, backups, monitoring, migration | Provider adapters selected per job |
| Domain delivery | Registration, transfer, DNS, certificates, renewals | Registrar/DNS adapters selected per job |
| Enterprise additions | High-value custom work, architecture, governance, support, integration, and operations | Sold as additions, not hidden in the base builder |

## Latest reseller workflow

```text
Lead / referral
→ qualify the commercial need
→ select domain + hosting + build package
→ create the Brushworks site package
→ choose the best provider route
→ deploy through authenticated provider access
→ attach custom domain and verify HTTPS
→ run Semrush technical and AI-search checks
→ deliver URL, ownership, support, and renewal record
→ route customer chats and microtool requests through MindReply
→ offer Aurel connectivity and enterprise additions where justified
```

## Provider route policy

| Need | Preferred route | Why |
|---|---|---|
| Code-first production site | Vercel/Git-connected host | Preview deployments, Git workflow, custom domains, strong ownership |
| Full-stack product | Lovable/Supabase-style or Base44-style route | Authentication, database, integrations, fast product assembly |
| Simple marketing site | Canva Websites | Fast visual production and straightforward publishing |
| Design-led site | Figma Sites | Responsive design iteration and collaborative visual control |
| Reseller operations | Brushworks | Provider-neutral commercial control and repeatable fulfilment |
| Service chat and follow-up | MindReply | Customer conversations, replies, triage, and next actions |
| Premium integration | Aurel | Optional high-end connectivity and operational layer |

## Enterprise-only additions

These are premium additions, not assumed features of every basic site package:

- Multi-provider cloud architecture.
- Server/runtime selection and migration.
- Database and storage architecture.
- Backup, monitoring, uptime, and incident procedures.
- Registrar and DNS API integration.
- Billing and subscription integration.
- Customer support chat routing.
- Microtool design and integration.
- CRM, email, analytics, and reporting connections.
- Security, access, audit, and governance controls.
- Bespoke enterprise delivery and ongoing operations.

## Comparison outcome

Brushworks is better positioned when it is evaluated as the **reseller and delivery operating layer wired to a builder**, not as a direct clone of Base44, Lovable, v0, Canva, or Figma Sites.

- Base44 and Lovable are strong application-generation routes.
- v0/Vercel is strong for code-first production delivery.
- Canva and Figma are strong for visual website creation.
- Brushworks must own the commercial workflow that none of those products is primarily designed to own: opportunity, package, domain, hosting, deployment evidence, support, renewal, and provider switching.
- MindReply handles the customer-service conversation layer.
- Aurel remains an optional premium connectivity and operations layer.

## Announcement-safe claims

### Ready to announce

- Brushworks is being positioned as a reseller-first website and digital delivery operating layer.
- The product covers domain, hosting, website package, deployment, support, and renewal workflows.
- The builder is wired into the reseller workflow.
- Provider selection is job-specific and provider-neutral.
- MindReply is the customer conversation and service-chat extension.
- Aurel is an optional premium connectivity and operations extension.
- The local reseller route is functional and tested.
- The public subdomain target is configured in the deployment register.

### Do not announce as live yet

- `brushworks.a11-k.space` is live.
- DNS has been changed.
- A hosting project is connected.
- A registrar or cloud provider has been provisioned.
- Payments or billing are active.
- Semrush has completed a public crawl.
- Enterprise integrations are connected.
- Revenue or customer delivery has been achieved.

## Current proof

| Area | Status | Evidence |
|---|---|---|
| Reseller UI | VERIFIED | `reseller.html`, `reseller.css`, `reseller.js` |
| Local route | VERIFIED | `/reseller` maps to reseller page |
| Opportunity capture | VERIFIED | POST `/api/leads`, local `.brushworks/leads.json` |
| Project generation | VERIFIED | Existing automated test passes |
| Package export | VERIFIED | Existing automated test passes |
| Deployment target | VERIFIED | GET `/api/deployment-target` |
| Public subdomain | UNVERIFIED | Requires DNS/hosting access |
| Semrush public audit | READY | Run only after public HTTPS response |
| MindReply integration | READY-DESIGN | Defined as customer-service layer; not connected in this local build |
| Aurel connectivity | READY-DESIGN | Defined as optional premium layer; not connected in this local build |

## Source links

### Builder and deployment benchmarks

- [Base44 Developers](https://base44.com/developers)
- [Base44 Features](https://docs.base44.com/developers/backend/overview/features)
- [Base44 Custom Domains](https://docs.base44.com/Setting-up-your-app/Setting-up-your-custom-domain)
- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Deployment, Hosting, and Ownership](https://docs.lovable.dev/tips-tricks/deployment-hosting-ownership)
- [Lovable Custom Domains](https://docs.lovable.dev/features/custom-domain)
- [Lovable Supabase Integration](https://docs.lovable.dev/integrations/supabase)
- [Lovable GitHub Integration](https://docs.lovable.dev/integrations/github)
- [v0 Documentation](https://v0.app/docs)
- [v0 Deployments](https://v0.app/docs/deployments)
- [v0 Custom Domains](https://v0.app/docs/custom-domains)
- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Vercel Custom Domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Canva Websites](https://www.canva.com/create/websites/)
- [Canva Publishing](https://www.canva.com/help/publishing-canva-websites/)
- [Canva Custom Domains](https://www.canva.com/help/publishing-websites-own-domains/)
- [Figma Sites](https://www.figma.com/sites/)
- [Figma Publishing](https://help.figma.com/hc/en-us/articles/31242845959703-Publish-update-or-unpublish-a-site)
- [Figma Custom Domains](https://help.figma.com/hc/en-us/articles/31414274019863-Manage-a-custom-domain-for-your-site)

### Infrastructure and reseller operations

- [GoDaddy Domains API](https://developer.godaddy.com/en/docs/references/rest/domains/v3)
- [Cloudflare Registrar API](https://developers.cloudflare.com/registrar/registrar-api/)
- [Openprovider Reseller API](https://developers.openprovider.com/)
- [DigitalOcean Documentation](https://docs.digitalocean.com/)
- [AWS Partner Network](https://aws.amazon.com/partners/)

### Audit and search visibility

- [Semrush Site Audit](https://www.semrush.com/features/site-audit/)
- [Semrush Site Audit checks](https://www.semrush.com/kb/31-site-audit)
- [Semrush AI Search Health](https://www.semrush.com/kb/1601-ai-search-health-audit)
- [Google Search Central SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Google Search Central Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
