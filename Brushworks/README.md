# Brushworks

**A11-K local-first design-to-site studio — create, shape, package.**

Brushworks turns a brief into a structured, conversion-focused site package while keeping drafts and exports on the local machine. It includes a portfolio surface for **A11-K.space, MindReply, Aurel, Brushworks, and LetReseller**.

## Start

```powershell
npm run dev
```

Open `http://127.0.0.1:4177/`.

## Verify

```powershell
npm test
npm run verify
```

## Surfaces

| Surface | Path | Role |
|---|---|---|
| Home | `index.html` | Creative entry, sparks, blocks, and publish flow |
| Portfolio | In-app `Portfolio` tab | A11-K catalogue and commercial project workspace |
| Studio | `studio.html` | Photopea-wrapped design room |
| Builder | `builder.html` | Existing draft-to-approve interface |
| API | `server.mjs` | Local projects, generation, duplication, and packaging |

## Local storage

Project state and package exports are created under `.brushworks/`. This directory is Git-ignored. Keep secrets, credentials, payment data, customer PII, and restricted accounting content out of the workspace.

## Status boundary

Local package generation is verifiable. Live deployment, DNS, billing, provider connectivity, customer sales, and revenue are not claimed by this repository.

See `WORKSPACE.md`, `PORTFOLIO.md`, `SALES_KIT.md`, and `A11-K_PORTFOLIO_WORKSPACE.md` for operating and commercial guidance.
