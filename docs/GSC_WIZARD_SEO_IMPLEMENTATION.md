# GSC Wizard SEO Implementation

## Status

Prepared as the implementation contract for the GSC Wizard SEO workflow described in the supplied `GSC-Wizard-SEO-MCP-PROMPTS.pdf`.

This document deliberately does **not** claim that Google Search Console, Bing Webmaster Tools, GA4, or GSC Wizard MCP are connected. Those external connections are prerequisites for live SEO measurements.

## Target workflow

1. **Content groups / topic clusters** — group pages by topic and identify cluster coverage and gaps.
2. **On-page SEO** — inspect title, meta description, H1, word count, internal links, canonical/indexability and related signals.
3. **Content decay** — find pages with meaningful traffic decline and prioritize refreshes.
4. **Query decay** — identify declining queries and map them to affected pages.
5. **Cannibalization** — detect multiple URLs competing for the same intent/query and recommend consolidation.
6. **Bing vs GSC** — compare query/page performance and identify discrepancies.
7. **GA4 conversion analysis** — connect organic landing pages with conversion outcomes where available.
8. **Core Web Vitals** — identify failing/needs-improvement pages and affected templates.
9. **Page poaching** — identify competitors' pages that are strong candidates to outrank.
10. **CTR analysis** — find high-impression, low-CTR queries/pages and prioritize snippet improvements.
11. **Opportunity scoring** — score opportunities using traffic, intent, difficulty, decay, and conversion value where the connected data supports them.
12. **Index monitoring** — monitor indexed/discovered/excluded URL changes and errors.
13. **CWV monitoring** — track Core Web Vitals changes over time.
14. **Algorithm-update analysis** — correlate traffic changes with documented update periods when data is available.
15. **IndexNow** — support eligible URL notification workflows where the target search engine supports it.

## Live MCP capability checklist

The supplied workflow names these operations as required/desired capabilities:

- `query_top_pages`
- `find_decaying_content`
- `analyze_cannibalization`
- `get_ga4_overview`
- `get_core_web_vitals`
- `find_page_poaching_opportunities`
- `analyze_ctr_curve`
- `score_opportunities`
- `check_index_status`
- `get_gsc_traffic`
- `get_search_analytics`
- `compare_bing_gsc`
- `analyze_algorithm_update`
- `get_index_coverage`
- `submit_indexnow`

## GitHub execution model

The intended production loop is:

`Search data -> analysis -> scored opportunities -> GitHub issue/implementation -> deployment -> verification`

GitHub should contain the implementation, configuration templates, workflow definitions, audit evidence and change history. Secrets and live OAuth/API credentials must remain outside committed source files.

## Current repository finding

No repository named or indexed as `GSC Wizard SEO` was found in the connected GitHub account during the initial inventory. The active `Mind-Reply/A11-K` repository is a Sofia Tech Ledger project, so this file is an implementation contract rather than a claim that its production site is already connected to GSC Wizard.

## Required external prerequisites for live measurements

- Google Search Console property access
- GA4 property access, if conversion analysis is required
- Bing Webmaster Tools access for Bing comparison
- GSC Wizard MCP/API connection exposing the required operations
- Site URL/property mapping
- Secure secret storage for credentials/tokens

## Acceptance evidence

A live implementation is only considered complete when the repository contains working integration code/configuration and a run produces real evidence for the available sources. A document describing the workflow alone is not completion.
