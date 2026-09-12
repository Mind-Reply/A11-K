# A11K Price Monitor

Automation #8 in the A11K Sovereign Execution Plane: monitor public product prices and produce evidence-backed change/threshold alerts.

## Lifecycle

`RESEARCH → RECOMMEND → PREPARE → REQUEST APPROVAL → PURCHASE → VERIFY`

This component stops at monitoring. It does **not** purchase anything.

## Safety boundary

- Only HTTPS targets are accepted.
- Hostnames must be explicitly listed in `allowedHosts`.
- Redirect destinations are revalidated.
- Private/loopback/link-local IP literals are rejected.
- No cookies, authorization headers, payment credentials, or owner secrets are sent.
- A price observation is not a purchase or approval.
- If extraction is ambiguous, the run records `UNVERIFIED` rather than guessing.

## Target format

Each target contains `id`, `url`, `allowedHosts`, `currency`, `pricePattern`, and optional `below` threshold.

Example:

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

The worker writes `price-monitor-results.json` with one evidence record per target. Statuses are `OK`, `ALERT`, `UNVERIFIED`, or `FAILED`.

The GitHub Actions workflow uploads the result as an artifact. A future control-plane adapter can persist the same records into the A11K Evidence Plane and route alerts through the owner approval queue.

## Current state

No real product targets are enabled by default. An owner must explicitly add targets and allowed hosts before external monitoring occurs.
