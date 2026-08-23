# Brushworks deployment register

## Canonical target

```text
https://brushworks.a11-k.space
```

## Functional reseller route

```text
https://brushworks.a11-k.space/reseller
```

The `/reseller` route is the intended commercial entry point. It exposes the reseller workflow for domains, hosting, website packages, deployment handoff, support, renewals, and local opportunity capture.

## Current verified state

| Gate | Status | Evidence / condition |
|---|---|---|
| Local reseller page | VERIFIED | `reseller.html`, `reseller.js`, `reseller.css` present |
| Local route | VERIFIED | Local server maps `/reseller` to `reseller.html` |
| Health endpoint | VERIFIED | `/api/health` reports local-only readiness |
| Deployment target | VERIFIED | `/api/deployment-target` returns the canonical hostname and route |
| DNS record | BLOCKED | Requires authenticated DNS provider access and provider-issued target |
| Hosting project | BLOCKED | Requires authenticated hosting account/project |
| HTTPS certificate | UNVERIFIED | Can only be checked after DNS and hosting are connected |
| Public URL response | UNVERIFIED | Must be checked after deployment |
| Semrush crawl | READY | Run after the URL returns a public `200` response |

## Required production sequence

1. Create or select the hosting project for Brushworks.
2. Deploy the repository or static build to that project.
3. Add `brushworks.a11-k.space` as the custom domain.
4. Copy the exact DNS record supplied by the hosting provider.
5. Add only that record at the authoritative DNS provider.
6. Wait for provider verification and certificate issuance.
7. Verify:
   * `https://brushworks.a11-k.space/`
   * `https://brushworks.a11-k.space/reseller`
   * `https://brushworks.a11-k.space/api/health` if the production host supports the server route
   * `https://brushworks.a11-k.space/robots.txt`
   * `https://brushworks.a11-k.space/sitemap.xml`
8. Run the Semrush audit and resolve critical errors before promotion.

## Deployment URL policy

| Use | URL |
|---|---|
| Main Brushworks entry | `https://brushworks.a11-k.space/` |
| Reseller command surface | `https://brushworks.a11-k.space/reseller` |
| Local development | `http://127.0.0.1:4177/` |
| Local reseller route | `http://127.0.0.1:4177/reseller` |
| Temporary host URL | Provider-issued URL only; do not invent one |

## DNS policy

Do not guess a CNAME, A record, nameserver, or verification token. The hosting provider must issue the authoritative value. The `brushworks` label should be used for the subdomain unless the provider explicitly requires another record name.

## Release gate

The subdomain is not considered live until all of these are independently true:

- DNS resolves to the selected hosting provider.
- HTTPS loads without a certificate warning.
- `/reseller` returns the reseller interface.
- The canonical URL does not redirect to an unintended provider URL.
- `robots.txt` and `sitemap.xml` are reachable.
- No production page exposes local-only wording, test data, credentials, or private paths.
- Semrush shows no unresolved critical crawlability, HTTPS, indexability, or security blockers.

## Sources

- [v0 custom domains](https://v0.app/docs/custom-domains)
- [v0 deployments](https://v0.app/docs/deployments)
- [Lovable deployment, hosting, and ownership](https://docs.lovable.dev/tips-tricks/deployment-hosting-ownership)
- [Base44 custom domains](https://docs.base44.com/Setting-up-your-app/Setting-up-your-custom-domain)
- [Canva custom domains](https://www.canva.com/help/publishing-websites-own-domains/)
- [Figma custom domains](https://help.figma.com/hc/en-us/articles/31414274019863-Manage-a-custom-domain-for-your-site)
