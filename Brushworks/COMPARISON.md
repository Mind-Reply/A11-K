# Brushworks comparison matrix — reseller-first deployment decision

## Position

Brushworks is being designed as a provider-neutral commercial delivery layer for resellers, agencies, and owner-operators. It should combine site creation with opportunity intake, domain/hosting coordination, package handoff, support, renewals, and deployment evidence.

The comparison benchmarks are **Base44**, **Lovable**, **v0**, **Canva Websites**, and **Figma Sites**. Their capabilities are used as requirements to beat or integrate around; their branding, code, and proprietary workflows are not copied.

## Capability matrix

| Capability | Brushworks target | Base44 | Lovable | v0 | Canva Websites | Figma Sites |
|---|---|---|---|---|---|---|
| Prompt-to-site creation | Local prompt-to-layout generation with reusable commercial blocks | AI app generation | AI full-stack generation | Prompt-to-code generation | AI-assisted design/content workflows | Design-led site generation |
| Visual editing | Structured local builder with deterministic export | App builder | Visual editing plus code workflow | Code-first with visual preview | Strong visual editor | Strong visual editor |
| Responsive design | Required release gate with mobile checks | Supported by generated apps | Supported in generated apps | Supported through code and preview | Strong responsive publishing | Responsive layouts and breakpoints |
| Templates | Reseller, SaaS, portfolio, commerce, luxury, service templates | App templates and generated starting points | Starter projects and generated structures | Templates/examples and generated UI | Large design template library | Community/design resources |
| Multi-page support | Pages and blocks stored in project state | Multi-page app flows | Multi-page applications | Multi-route applications | Multi-page websites depending on workflow | Multi-page sites |
| Authentication | Provider boundary; connect auth without locking the package | Built-in backend/auth capabilities | Supabase authentication path | Add through code/backend integrations | Limited website-oriented auth | Limited website-oriented auth |
| Database | Provider-neutral data boundary; local-first prototype | Built-in database/backend | Supabase database integration | Add external backend/database | Not a general application database | Not a general application database |
| File storage | Exportable package assets with explicit storage boundary | Managed app storage/features | Supabase/storage integrations | Provider or code-defined storage | Hosted design/site assets | Hosted site assets |
| AI/image generation | Prompt-to-layout; optional provider adapters | AI app generation | AI coding workflow | AI code/UI generation | Strong AI design/image/content features | Design tooling and AI features vary |
| Code export | Required: package export and ownership evidence | Platform-dependent; verify export limits per plan | GitHub sync and code ownership path | Strong code ownership through generated app | Limited website code portability | Site publishing is design-led; export model differs |
| GitHub integration | Planned/required for production workflow | Developer workflow varies | Strong GitHub workflow | Strong Vercel/Git workflow | Not core | Not core |
| Hosting | External provider-neutral deployment target | Managed hosting | Managed hosting plus deployment choices | Vercel-native deployment | Canva-hosted publishing | Figma-hosted publishing |
| Preview deployments | Local preview now; provider previews on deployment | Managed previews | Preview/deployment workflow | Strong preview/deployment workflow | Design preview/publish flow | Preview/publish flow |
| Custom domains | Required with provider-issued DNS records | Supported on eligible plans | Supported on eligible plans | Supported through Vercel | Supported with plan/provider conditions | Supported with plan/provider conditions |
| Subdomains | `brushworks.a11-k.space` as reseller route target | Depends on custom domain setup | Depends on hosting/domain setup | Supported through hosting/domain configuration | Depends on publishing/domain setup | Depends on custom-domain setup |
| SSL/HTTPS | Release gate; verify before claiming live | Managed by platform | Managed by deployment provider | Managed by Vercel | Managed by publishing provider | Managed by publishing provider |
| DNS requirements | Document exact provider-issued CNAME/A/verification values | Custom-domain DNS instructions | Custom-domain DNS instructions | Vercel DNS/custom-domain instructions | Custom-domain instructions | Custom-domain instructions |
| Payments | Adapter boundary; no payment action without approval | App integrations possible | Build through integrations/code | Add through code/integrations | Commerce/payment features depend on product/workflow | External integrations/workarounds required |
| Forms and lead capture | Local lead capture now; authenticated delivery adapter later | App data/forms possible | Build with backend/integrations | Build with code/backend | Forms and marketing collection features | Forms through embeds/integrations |
| Analytics | Deployment checklist and adapter boundary | Integrations available | Integrations available | Vercel/third-party analytics path | Marketing/site analytics options | Analytics path depends on publishing setup |
| SEO | Metadata, sitemap, robots, canonical, structured-data release gates | App SEO varies by output | SEO via generated app/configuration | SEO through code and deployment | Strong basic website SEO controls | SEO controls through site publishing |
| AI-search visibility | Explicit audit route with Semrush and answer-ready content | Depends on generated output | Depends on generated output | Depends on generated output | Content/SEO workflow dependent | Content/SEO workflow dependent |
| Client approvals | Required commercial workflow: package preview, status, evidence | Not reseller-specific | Collaboration workflow, not full reseller ops | Collaboration/deployment workflow | Strong design sharing/commenting | Strong design sharing/commenting |
| Revision tracking | Project versions, exports, and status evidence | Platform history varies | Git/version workflow | Git/version workflow | Design/version history | Strong design version history |
| Reseller workflows | Core differentiator: opportunity → package → deploy → support → renew | Not the primary product | Not the primary product | Not the primary product | Not the primary product | Not the primary product |
| Domain APIs | Provider-neutral adapter boundary; Openprovider/registrar adapters later | Not the core workflow | Not the core workflow | Not the core workflow | Not the core workflow | Not the core workflow |
| Provider lock-in | Must remain low: portable package and explicit provider boundary | Higher managed-platform dependency | Medium: Git/Supabase improve portability | Medium: strong Vercel association but code is portable | Higher publishing dependency | Higher publishing dependency for published sites |
| Exportability | Core requirement: HTML, assets, project manifest, handoff README | Verify per output and plan | GitHub/export path is a strength | Code export is a strength | More limited than code-first tools | Publishing/design-led model |
| Deployment ownership | Owner controls target provider, domain, DNS, and release evidence | Platform-managed | Shared between user, Git, Supabase, and host | Strong developer ownership through Vercel/Git | Platform-managed publishing | Platform-managed publishing |
| Operational cost/control | Local-first prototype; provider costs explicit; no hidden execution | Managed platform pricing | Platform and integrated-provider pricing | Vercel and connected-service pricing | Plan-based publishing/design pricing | Plan-based design/publishing pricing |
| Reseller margin visibility | Required: package cost, provider cost, renewal, margin, status | Not a reseller accounting surface | Not a reseller accounting surface | Not a reseller accounting surface | Not a reseller accounting surface | Not a reseller accounting surface |
| Support and renewals | Required objects and reminders in the operating layer | App-specific support possible | Build/custom workflow | Build/custom workflow | Customer/site workflow, not reseller operations | Customer/site workflow, not reseller operations |

## What Brushworks must be better at

1. **Commercial ownership:** every project has a client/opportunity, package, delivery status, URL, provider, renewal date, and evidence trail.
2. **Provider neutrality:** the client package is not trapped inside one website builder.
3. **Deployment clarity:** every public URL has an explicit DNS, hosting, HTTPS, and verification state.
4. **Reseller margin control:** acquisition cost, sell price, renewal cost, and margin are visible locally without exporting restricted financial data.
5. **Handoff quality:** export includes an HTML artifact, assets, project manifest, README, and deployment instructions.
6. **Repeatability:** the same workflow works for domains, hosting, websites, support, renewals, and migration.
7. **SEO and AI-search readiness:** Semrush checks are release gates, not afterthoughts.
8. **Truthful automation:** no provider action, payment, DNS mutation, email, or live-status claim without authenticated evidence.
9. **Client approvals:** preview, requested changes, accepted package, and release evidence are separate states.
10. **Integration boundaries:** registrar APIs, hosting APIs, payment providers, analytics, CRM, and email can be connected later without rewriting the local core.

## Deployment recommendation

### Primary reseller route

```text
https://brushworks.a11-k.space/reseller
```

### Public site route

```text
https://brushworks.a11-k.space/
```

### Recommended implementation model

```text
Brushworks local/project core
        ↓
portable package export
        ↓
selected hosting provider
        ↓
provider-issued custom-domain record
        ↓
brushworks.a11-k.space
        ↓
Semrush crawl and release evidence
```

### Provider selection rule

- Use **Vercel** when the deployment is code-first, Git-connected, and the project needs preview environments.
- Use **Lovable/Supabase-style architecture** when the project needs a rapidly assembled full-stack product with authentication and database functionality.
- Use **Base44-style architecture** when the priority is managed app generation with backend features and minimal infrastructure handling.
- Use **Canva Websites** when the deliverable is a simple visual marketing site with low technical complexity.
- Use **Figma Sites** when design precision, responsive layout exploration, and collaborative visual iteration dominate.
- Use **Brushworks** as the reseller control layer regardless of the downstream provider.

## Source links

### Base44

- [Base44 Developers](https://base44.com/developers)
- [Base44 Features](https://docs.base44.com/developers/backend/overview/features)
- [Base44 Custom Domains](https://docs.base44.com/Setting-up-your-app/Setting-up-your-custom-domain)
- [Base44 Authentication](https://docs.base44.com/developers/backend/overview/authentication)
- [Base44 Integrations](https://docs.base44.com/developers/backend/overview/integrations)

### Lovable

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Deployment, Hosting, and Ownership](https://docs.lovable.dev/tips-tricks/deployment-hosting-ownership)
- [Lovable Custom Domains](https://docs.lovable.dev/features/custom-domain)
- [Lovable Supabase Integration](https://docs.lovable.dev/integrations/supabase)
- [Lovable GitHub Integration](https://docs.lovable.dev/integrations/github)

### v0 and Vercel

- [v0 Documentation](https://v0.app/docs)
- [v0 Deployments](https://v0.app/docs/deployments)
- [v0 Custom Domains](https://v0.app/docs/custom-domains)
- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Vercel Custom Domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain)

### Canva Websites

- [Canva Websites](https://www.canva.com/create/websites/)
- [Publishing Canva Websites](https://www.canva.com/help/publishing-canva-websites/)
- [Canva Custom Domains](https://www.canva.com/help/publishing-websites-own-domains/)
- [Canva Website SEO](https://www.canva.com/help/website-seo/)

### Figma Sites

- [Figma Sites](https://www.figma.com/sites/)
- [Publish, Update, or Unpublish a Site](https://help.figma.com/hc/en-us/articles/31242845959703-Publish-update-or-unpublish-a-site)
- [Figma Custom Domains](https://help.figma.com/hc/en-us/articles/31414274019863-Manage-a-custom-domain-for-your-site)
- [Figma Sites SEO](https://help.figma.com/hc/en-us/articles/32208747474455-Optimize-your-site-for-search-engines)

### Domain and reseller infrastructure

- [GoDaddy Domains API](https://developer.godaddy.com/en/docs/references/rest/domains/v3)
- [Cloudflare Registrar API](https://developers.cloudflare.com/registrar/registrar-api/)
- [Openprovider Reseller API](https://developers.openprovider.com/)

### SEO and Semrush

- [Semrush Site Audit](https://www.semrush.com/features/site-audit/)
- [Semrush Site Audit Checks](https://www.semrush.com/kb/31-site-audit)
- [Semrush AI Search Health](https://www.semrush.com/kb/1601-ai-search-health-audit)
- [Google Search Central SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Google Search Central Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
