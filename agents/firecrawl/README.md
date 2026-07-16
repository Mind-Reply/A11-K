# Firecrawl Agent (MRPRODUCTION)

Wrap-only research layer for **BRUSHworks** + **Unapologetic**.

Playground (search): https://www.firecrawl.dev/app/playground?endpoint=search

## Setup (once)

1. Open the playground link above and sign in.
2. Copy API key (`fc-...`).
3. Fresh PowerShell:

```powershell
$env:FIRECRAWL_API_KEY = "fc-YOUR_KEY"
```

Optional permanent (User env — do not commit):

```powershell
[System.Environment]::SetEnvironmentVariable("FIRECRAWL_API_KEY", "fc-YOUR_KEY", "User")
```

## Search

```powershell
cd D:\MRPRODUCTION\ESTATE\agents\firecrawl
.\search.ps1 -Query "luxury cosmetics dropshipping suppliers Europe"
.\search.ps1 -Query "Unapologetic beauty brand positioning" -Limit 8
```

## Scrape a page

```powershell
.\scrape.ps1 -Url "https://example.com/product"
```

## Estate uses

| Brand | Use |
|---|---|
| BRUSHworks | Competitor UI research, template inspiration, SEO SERP checks |
| Unapologetic | Supplier discovery, beauty trend SERPs, social angle research |
| All agents | Feed results into n8n / Amplifier / Herald later |

## Security

* Never put `FIRECRAWL_API_KEY` in public GitHub Pages HTML.
* Never commit `.env` with the key.
* Scripts read env only.

Directive 001: wrap Firecrawl — do not rebuild a crawler.
