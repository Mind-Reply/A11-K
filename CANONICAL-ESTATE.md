# A11-K Estate Consolidation

## Canonical

**Repository:** `angellllkr-eng/A11-K`  
**Production site:** `https://a11-k.space`

The personal A11-K repository is now the single implementation source because it contains the richer verified application, route structure, deployment configuration and operational material.

## Migration/reference repositories

- `Mind-Reply/A11-K` — this repository; public historical/reference surface
- `angellllkr-eng/a11k-surface` — private historical satellite

Separate products such as `nowline` and `a11-nowline` are not A11-K and remain separate.

Useful A11-K material should be extracted into the canonical repository. No new product work should be started here.

## Operating rule

**One product → one canonical repository → one production site.**

Repository consolidation does not by itself prove deployment. Verify build, runtime, DNS/HTTP and rollback before calling the site live.
