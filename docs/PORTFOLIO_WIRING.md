# Portfolio Wiring Contract

Every production property must declare:

- canonical URL
- source repository
- production branch
- known-good deployment
- health endpoint/smoke path
- primary recovery action
- fallback action
- verification method
- owner gate for consequential changes

Suggested product roles:

| Product | Primary role | Fallback | Core proof |
|---|---|---|---|
| MindReply | commercial/product hub | known-good deployment | critical routes + conversion path |
| A11-K | decision/recovery platform | rollback candidate | decision trace + recovery simulation |
| ResellerPro | transaction engine | read-only mode | domain/checkout path |
| Radar | opportunity intelligence | cached evidence | source freshness + recommendation |
| WhatsApp Router | message routing | alternate provider/path | delivery + routing trace |

Do not expose internal control-plane services as public products merely because they have a deployment URL.
