# Brushworks

**MRPRODUCTION system layer** — Create. Design. Publish.

| Surface | Path | Engine |
|---|---|---|
| Home | `index.html` | Brand shell |
| Studio | `studio.html` | Photopea wrap |
| Builder | `builder.html` | MRstation draft → approve → publish UI |

## Directive 001

Never build from scratch. Wrap existing tools, brand them, ship.

## Local CLI

From `C:\Users\skyri\MRPRODUCTION\brands\brushworks`:

```bash
node builder.js create "ProjectName" premium-saas
node builder.js list
node builder.js deploy-prep <projectId>
```

## Deploy

Static files in this folder → GitHub Pages / Cloudflare Pages.  
No build step required for the shell.

## Ownership

See `LICENSE` and `OWNERSHIP.md`. Fingerprint: `LIBRA-BW-AK-2026`.
