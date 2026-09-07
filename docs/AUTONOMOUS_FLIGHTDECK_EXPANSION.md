# Autonomous Flight Deck Expansion

This expansion adds a navigable operating surface around the existing A11-K estate without pretending that presentation equals execution.

## Surfaces

- `flight-deck.html` — command overview
- `operations.html` — observe/decide/execute/verify loop
- `revenue.html` — model-optional revenue continuity
- `automations.html` — autonomous vs owner-gated action matrix
- `evidence.html` — reality/evidence rules
- `recovery.html` — fail-closed recovery model
- `estate.html` — canonical estate map
- `ops/autonomy-state.json` — machine-readable deterministic state

## Autonomous cycle

`.github/workflows/autonomous-flightdeck.yml` runs every six hours and on demand. It executes `scripts/autonomy-cycle.mjs`, verifies required surfaces and revenue policy, runs the repository test suite, scans source/scripts for common credential patterns, and refreshes the state file only when its deterministic state changes.

## Boundary

The cycle can observe, validate, record and create a bounded internal alert. It does not autonomously change prices, move money, publish customer communications, rotate credentials, alter DNS, promote production, or perform destructive changes.

AI remains an optional acceleration layer. Revenue-critical operation must remain possible without model services.
