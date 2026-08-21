# NIS2 inbound product — lawful build

Status: built locally as an inbound self-assessment. Outreach engine disabled.

## What this is

A company-submitted classifier and gap report for the amended Bulgarian Cybersecurity Act (ЗКС / NIS2).

The operator fills sector, size, and hygiene fields. The system returns:

- preliminary bracket: essential / important / out-of-scope / review-required
- vulnerability score 0–100
- missing hygiene controls
- entity-fine ceiling vs management-body administrative-fine range
- 24 / 72 / 30 incident clock
- next reversible steps

## What this is not

- not a legal opinion
- not a certified audit
- not a Commercial Register scrape
- not a RegiX / APIS connector
- not a personal-email harvester
- not an automated cold-email node

## Hard stops

- No manager names, personal emails, or phone numbers are collected unless the company types them into an inbound form for a callback they requested.
- `buildOutreachBg()` now throws.
- Fixture companies are labelled `FIXTURE-` and must never be mailed.
- 150 BGN PDF / 5,000–15,000 BGN implementation fees stay hypothetical until a real offer, invoice, and partner agreement exist.

## Official surfaces

- Founder: `site/official/index.html`
- Self-assessment: `site/official/nis2.html`
- Classifier: `src/nis2Scout.js`

## Monetization that is allowed later

1. Inbound self-assessment report, after the company asks for it.
2. Paid implementation only through a named, contracted Sofia cyber/legal partner.
3. ResellerPro / Mind-Reply ops bundle for firms that already pay for hosting/comms.

No list-buying. No scraped ЕИК + Управител packs.
