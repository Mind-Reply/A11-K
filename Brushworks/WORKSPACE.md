# Brushworks Workspace

## Operating boundary

Brushworks is a local-first, package-ready site studio. It stores drafts and generated exports under `.brushworks/` inside this project. It does not claim live deployment, revenue, customer approvals, or provider connectivity.

## Storage layout

```text
.brushworks/
  state.json       local workspace and project records
  exports/         package-ready project artifacts
```

The `.brushworks/` directory is intentionally ignored by Git. It may contain working drafts and generated artefacts; do not place secrets, credentials, payment data, customer PII, or restricted accounting content there.

## Run

```powershell
npm run dev
```

Open `http://127.0.0.1:4177/`.

## Verify

```powershell
npm test
npm run verify
```

## Commercial workflow

1. Open the **Portfolio** tab.
2. Select the relevant A11-K property: A11-K.space, MindReply, Aurel, Brushworks, or LetReseller.
3. Create a local project with a customer-outcome prompt.
4. Generate and refine the layout.
5. Package the project locally.
6. Independently verify a real hosting/provider connection before any live deployment claim.

## Evidence rule

Report only: `VERIFIED`, `READY`, `BLOCKED`, `FAILED`, or `UNVERIFIED`. Local package readiness is not the same as production deployment or sales.
