# A11 CEO — GitHub + Vercel Always-On Skill

## Trigger

Run this skill on **every message from CEO A.K.** when the message concerns A11, MindReply, public websites, repositories, deployments, domains, production, integrations, incidents, or execution. GitHub and Vercel are mandatory operating surfaces, not optional suggestions.

## Mandatory execution loop

1. **GitHub check** — inspect the relevant repository, branch, latest commit, files, workflows/status, issues/PRs, and current source of truth before making claims.
2. **Vercel check** — inspect the relevant project, production deployment, domain aliases, deployment state, build/runtime errors, and public response when applicable.
3. **Cross-system reconciliation** — compare GitHub source ↔ Vercel project/deployment ↔ public URL. Treat mismatches as incidents.
4. **Execute the smallest safe mutation** — prefer a concrete file/branch/PR/deployment correction over advice. Preserve rollback and avoid destructive changes.
5. **Verify externally** — re-check the deployment and public URL after changes. Do not mark GREEN without live evidence.
6. **Record state** — leave durable evidence in GitHub (commit/issue/PR/documentation) when the work creates a meaningful operational change.

## A11-K current priority

Canonical restoration target:

- Vercel project: `a11-k-core`
- Root Directory: `apps/a11k/public`
- Domains: `a11-k.space` and `www.a11-k.space`
- Verification: production 200, canonical URL, `og:title`, `application/ld+json`, and sitemap 200
- Fallback: `a11k-live-foundation` only if `a11-k-core` cannot be cleanly reconnected

## Incident rule

If `a11-k.space` or another production surface returns 404/5xx, immediately enter incident mode:

- identify the source-of-truth repository and Vercel project;
- inspect routing/root-directory/domain configuration;
- repair or reconnect using the least invasive path;
- deploy or promote only after source/build integrity is established;
- verify apex and `www` behavior;
- report exact status and remaining human gate if connector permissions prevent the final mutation.

## Human-gate rule

When a required action is unavailable through connected GitHub/Vercel capabilities (for example domain assignment, DNS ownership, account-level settings, or authentication), do not pretend it was completed. Produce one precise Owner Action Packet containing the exact setting/action required and the evidence needed to verify completion.

## Evidence standard

- `READY` deployment is not sufficient proof of a working custom domain.
- A source file existing in GitHub is not sufficient proof of production availability.
- A Vercel project existing is not sufficient proof of correct domain routing.
- Completion means source, deployment, domain, and public response agree.

## Safety

Never expose or copy secrets, credentials, private customer data, payment details, or authentication material into public files, issues, logs, or chat. Never claim revenue, funding, uptime, reach, or production status without evidence.
