# Autonomous Flight Deck Expansion

This expansion turns the written A11-K operating model into inspectable repository surfaces and a deterministic verification cycle.

## Surfaces

- `flight-deck.html` — command overview
- `operations.html` — observe/decide/execute/verify loop
- `revenue.html` — model-optional revenue continuity
- `automations.html` — autonomous vs owner-gated action matrix
- `evidence.html` — evidence rules
- `recovery.html` — fail-closed recovery model
- `estate.html` — canonical estate map
- `ops/autonomy-state.json` — machine-readable state

## Autonomous cycle

`.github/workflows/autonomous-flightdeck.yml` runs every six hours and on demand. It executes `scripts/autonomy-cycle.mjs`, verifies required surfaces and revenue policy, runs the repository test suite, scans source/scripts for common credential patterns, and refreshes the state file.

## Boundary

The cycle can observe, validate, record and create a bounded internal alert. It does not autonomously change prices, move money, publish customer communications, rotate credentials, alter DNS, promote production, or perform destructive changes.

Revenue-critical operation remains deterministic/manual when model services are unavailable.