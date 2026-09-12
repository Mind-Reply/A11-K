# A11K Price Monitor

Automation #8 in the A11K Sovereign Execution Plane: monitor public product prices and produce evidence-backed change/threshold alerts.

## Lifecycle

`RESEARCH → RECOMMEND → PREPARE → REQUEST APPROVAL → PURCHASE → VERIFY`

This component stops at monitoring. It does **not** purchase anything.

## Safety boundary

- Only HTTPS targets are accepted.
- Hostnames must be explicitly listed in `allowedHosts`.
- Redirect destinations are revalidated.
- Hostnames are DNS-resolved and private/loopback/link-local results are rejected before fetch.
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

The GitHub Actions workflow uploads the result as an artifact. The same evidence contract is intended to feed A11K communication adapters without granting those adapters purchase authority.

## Communication channels — 7

1. **A11K Owner Cockpit** — primary alert/evidence surface.
2. **Email** — owner notification for threshold alerts and failed checks.
3. **Slack** — operational alert stream when an owner-approved connector is enabled.
4. **Mobile push** — urgent alert delivery through the owner mobile app when enabled.
5. **Browser notification** — immediate cockpit/browser alert when permission is granted.
6. **Webhook** — signed machine-to-machine event delivery for approved downstream systems.
7. **Daily/periodic executive report** — consolidated price changes, alerts, failures, and unresolved `UNVERIFIED` observations.

These are communication routes only. None may approve or execute a purchase. Any purchase action must enter the A11K procurement approval boundary.

## Current state

The worker and scheduled workflow are implemented on `a11k-owner-operating-system`. No real product targets are enabled by default. An owner must explicitly add targets and allowed hosts before external monitoring occurs. Communication adapters are documented above; external delivery is not claimed until the corresponding connector is actually configured and verified.
