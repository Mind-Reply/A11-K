# A11K Price Monitor

Automation #8 in the A11K Sovereign Execution Plane: monitor public product prices and produce evidence-backed change/threshold alerts.

## Lifecycle

`RESEARCH → RECOMMEND → PREPARE → REQUEST APPROVAL → PURCHASE → VERIFY`

This component stops at monitoring. It does **not** purchase anything.

## Safety boundary

- Only HTTPS targets are accepted.
- Hostnames must be explicitly listed in `allowedHosts`.
- Redirect destinations are revalidated.
- Private/loopback/link-local IPv4 and IPv6 literals are rejected.
- No cookies, authorization headers, payment credentials, or owner secrets are sent.
- A price observation is not a purchase or approval.
- If extraction is ambiguous, the run records `UNVERIFIED` rather than guessing.

## Target format

Each target contains:

- `id`: stable monitor identifier
- `url`: public product URL
- `allowedHosts`: exact hostnames permitted for this target
- `currency`: expected currency code
- `selector`: optional CSS selector for the price element (HTML selector support is intentionally limited in this first dependency-free worker)
- `pricePattern`: regex used against the fetched HTML/text when no structured extraction is available
- `below`: optional alert threshold

Example shape:

```json
{
  "id": "example-product",
  "url": "https://example.com/product",
  "allowedHosts": ["example.com"],
  "currency": "EUR",
  "pricePattern": "€\\s*([0-9]+(?:[.,][0-9]{1,2})?)",
  "below": 100
}
```

## Output

The worker writes `price-monitor-results.json` with one evidence record per target. Statuses are:

- `OK`
- `ALERT`
- `UNVERIFIED`
- `FAILED`

The GitHub Actions workflow uploads this file as an artifact. A future control-plane adapter can persist the same records into the A11K Evidence Plane and route an alert through the owner approval queue.

## Current state

The repository contains the worker and scheduled workflow, but no real product targets are enabled by default. This prevents accidental external monitoring until an owner explicitly adds targets and their allowed hosts.
