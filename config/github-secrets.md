# Mind-Reply GitHub Secrets — estate map

**Important:** GitHub encrypts secrets. Nobody (including agents) can *read* secret values back — only set/update them and use them in Actions as `${{ secrets.NAME }}`.

## Secrets repo

| Repo | URL | Role |
|---|---|---|
| `Mind-Reply/repo-secrets-actions` | https://github.com/Mind-Reply/repo-secrets-actions | Private secrets/actions hub |
| `Mind-Reply/A11-K` | https://github.com/Mind-Reply/A11-K/settings/secrets/actions | Live multiverse + BRUSHworks + Unapologetic |
| Org secrets (optional) | https://github.com/organizations/Mind-Reply/settings/secrets/actions | Shared across all org repos |

## Add Firecrawl (you did playground, still need `fc-...` here)

1. Open: https://www.firecrawl.dev/app/api-keys (or playground → copy key)
2. Open: https://github.com/Mind-Reply/A11-K/settings/secrets/actions
3. **New repository secret**
   - Name: `FIRECRAWL_API_KEY`
   - Value: `fc-...` (paste once, never in chat/commits)
4. Optional org-level: same name under org secrets so every Mind-Reply repo can use it

## Recommended secret names (Mind-Reply)

| Secret name | Used for |
|---|---|
| `FIRECRAWL_API_KEY` | Research search/scrape agent |
| `CLOUDFLARE_API_TOKEN` | Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID` | Pages deploy |
| `XAI_API_KEY` / `GROK_API_KEY` | Grok agents |
| `OPENAI_API_KEY` | Optional LLM |
| `N8N_API_KEY` | Automation |
| `STRIPE_SECRET_KEY` | Ledger (later) |

## Local (this PC) — not GitHub

Fresh PowerShell (session only):

```powershell
$env:FIRECRAWL_API_KEY = "fc-..."   # paste your key
cd D:\MRPRODUCTION\ESTATE\agents\firecrawl
.\search.ps1 -Query "luxury cosmetics dropshipping"
```

User-permanent (still not committed):

```powershell
[System.Environment]::SetEnvironmentVariable("FIRECRAWL_API_KEY", "fc-...", "User")
```

## Local template keys found (AUREL / MindReply)

From `.env.template` / `.env.example` (names only):

* `ANTHROPIC_API_KEY`, `XAI_API_KEY`, `GROK_API_KEY`, `OPENAI_API_KEY`, `N8N_API_KEY`
* MindReply example also lists Supabase, Salesforce, JWT — **no FIRECRAWL yet**

Add `FIRECRAWL_API_KEY=` to local `.env` when you fill `fc-...`.

## Never

* Commit `.env` with real values
* Paste `fc-...` into public Pages HTML or this chat
* Expect agents to “pull” secret values from GitHub — impossible by design
