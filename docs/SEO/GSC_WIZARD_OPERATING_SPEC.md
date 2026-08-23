# GSC Wizard SEO Operating Specification

Status: IMPLEMENTED — integration-ready
Owner: Mind-Reply / A11-K
Primary target: public web properties owned by Mind-Reply

## Purpose

Operationalize the first-hour SEO workflow described in the supplied GSC Wizard workflow reference without pretending that Google Search Console, Bing Webmaster Tools, GA4, or GSC Wizard credentials are already connected.

## Analysis lanes

1. Content groups and topic clusters
2. On-page SEO
3. Content decay
4. Query decay
5. Cannibalization
6. Bing vs. Google Search Console
7. GA4 conversion performance
8. Core Web Vitals
9. Page-poaching opportunities
10. CTR curve analysis
11. Opportunity scoring
12. Index monitoring
13. Core Web Vitals monitoring
14. Algorithm-update impact analysis
15. IndexNow submission

## Required external inputs

- Google Search Console property access
- Bing Webmaster Tools access where applicable
- GA4 property access where applicable
- GSC Wizard MCP/API access if the supplied workflow is to be executed through its named functions
- IndexNow key for eligible engines

## Safety rules

- Never commit credentials, tokens, cookies, service-account JSON, or exported private search data.
- Keep secrets in GitHub Actions Secrets or an external secret manager.
- Reports must contain only the minimum data required for operational decisions.
- Do not auto-publish SEO/content changes from analytics alone.
- Create a reviewable GitHub change before modifying production content.

## GitHub execution model

External SEO data -> normalized report -> opportunity score -> GitHub issue/PR -> review -> deploy -> post-deploy verification.

The repository can perform deterministic technical checks now. Analytics-dependent findings remain blocked until their external data connections exist.

## Opportunity scoring

Use a transparent score with these dimensions:

- traffic potential
- business value
- CTR gap
- ranking position
- decay severity
- implementation effort
- technical risk

Record the evidence and the calculation for every recommendation.

## Definition of done

A site is SEO-operational only when:

- robots.txt is reachable
- sitemap.xml is reachable and valid
- canonical URLs are present where applicable
- indexability is intentional
- important pages return successful HTTP responses
- structured data is syntactically valid where used
- GSC/Bing/GA4 connections are verified where required
- opportunities are evidence-backed
- production changes have a Git history and verification result
