# Semrush site-check gate

## Audit target

```text
https://brushworks.a11-k.space
```

Primary commercial route:

```text
https://brushworks.a11-k.space/reseller
```

This file is a deployment-ready audit specification. A live Semrush crawl must not be claimed until the subdomain is publicly reachable and DNS/HTTPS are verified.

## Pre-crawl checks

- [ ] DNS resolves for `brushworks.a11-k.space`.
- [ ] HTTPS certificate is valid.
- [ ] `/` returns `200`.
- [ ] `/reseller` returns `200`.
- [ ] `/robots.txt` returns `200`.
- [ ] `/sitemap.xml` returns `200`.
- [ ] No staging, localhost, filesystem, credential, or internal operational text is exposed.
- [ ] The canonical hostname is consistent across canonical tags, sitemap URLs, redirects, and structured data.

## Semrush Site Audit checks

| Area | Required check | Release requirement |
|---|---|---|
| Crawlability | robots.txt, sitemap, status codes, orphan pages | No critical crawl block |
| HTTPS | certificate, mixed content, HTTP-to-HTTPS redirect | Valid HTTPS and clean redirect |
| Indexability | no accidental noindex, canonical consistency | Public commercial pages indexable |
| Metadata | title, meta description, H1, duplicate metadata | Unique metadata for key routes |
| Links | broken internal/external links, redirect chains | No broken commercial links |
| Performance | Core Web Vitals and heavy assets | Resolve high-impact issues |
| Mobile | viewport, responsive layout, tap targets | No critical mobile errors |
| Security | HTTPS and unsafe resource references | No critical security warnings |
| Markup | structured data validity | Valid relevant schema only |
| International | language and hreflang if used | `en-GB` is consistent |
| Images | alt text, dimensions, compression | No missing critical alt text |

## Reseller-specific crawl checks

- [ ] Reseller page has a clear title containing the commercial purpose.
- [ ] Reseller page has one primary H1.
- [ ] Domain, hosting, package, deployment, support, and renewal concepts are crawlable text, not only visual labels.
- [ ] Opportunity form has labels, input names, required states, and useful validation.
- [ ] Form submission does not transmit PII to an external provider without an explicit integration.
- [ ] Form success state does not claim that a message was sent unless an authenticated delivery system actually sent it.
- [ ] Domain and hosting provider links are clearly labelled as external references.
- [ ] No invented prices, availability, registrar status, deployment status, or revenue claims appear as facts.
- [ ] The reseller route is linked from the main Brushworks navigation and sitemap when ready for indexing.
- [ ] The page explains the delivery boundary: Brushworks coordinates the workflow; provider execution requires connected accounts.

## AI-search visibility checks

Semrush AI-search review should verify:

- Clear entity identity for Brushworks.
- Clear explanation of the reseller operating model.
- Distinct comparison language against Base44, Lovable, v0, Canva Websites, and Figma Sites.
- Consistent canonical URL.
- Descriptive headings and concise answer-ready sections.
- No unsupported superiority claims.
- Links to authoritative provider documentation.
- `Organization`, `WebSite`, `Service`, and `FAQPage` schema only where the page content genuinely supports it.

## Recommended Semrush project configuration

- Domain: `brushworks.a11-k.space`
- Crawl scope: subdomain only
- Protocol: HTTPS
- Crawl limit: start small, then expand after the first clean run
- User agent: default desktop and mobile checks
- Include: `/`, `/reseller`, public portfolio and comparison pages
- Exclude: `.brushworks`, exports, local test paths, private operational files, and API write routes
- Schedule: after each production release until critical issues remain at zero

## Evidence to save after the crawl

- Audit date and timezone: Europe/Sofia.
- Project/domain configuration.
- URLs crawled.
- Health score.
- Errors, warnings, and notices.
- Critical issues resolved.
- Remaining accepted issues.
- Screenshot or export of the final result.
- Public HTTP status evidence for `/` and `/reseller`.

## Sources

- [Semrush Site Audit](https://www.semrush.com/features/site-audit/)
- [Semrush Site Audit checks](https://www.semrush.com/kb/31-site-audit)
- [Semrush AI Search Health](https://www.semrush.com/kb/1601-ai-search-health-audit)
- [Google Search Central: SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central: robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Google Search Central: sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
