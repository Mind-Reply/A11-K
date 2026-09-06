#!/usr/bin/env python3
"""Validate the A11-K reality-claim registry without network access."""
from __future__ import annotations

import json
from pathlib import Path

ALLOWED = {"UNKNOWN", "PARTIAL", "BROKEN", "DUPLICATE", "ORPHAN", "FROZEN", "VERIFIED"}
REQUIRED = {"id", "subject", "claim", "state"}


def main() -> int:
    path = Path(__file__).parents[1] / "ops" / "reality-claims.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema") != "a11k.reality-claim/v1":
        raise SystemExit("invalid schema identifier")
    claims = data.get("claims")
    if not isinstance(claims, list) or not claims:
        raise SystemExit("claims must be a non-empty list")

    ids: set[str] = set()
    for claim in claims:
        if not isinstance(claim, dict) or not REQUIRED.issubset(claim):
            raise SystemExit(f"claim missing required fields: {claim!r}")
        if claim["id"] in ids:
            raise SystemExit(f"duplicate claim id: {claim['id']}")
        ids.add(claim["id"])
        if claim["state"] not in ALLOWED:
            raise SystemExit(f"invalid state for {claim['id']}: {claim['state']}")
        if claim["state"] == "VERIFIED" and not (claim.get("github") or claim.get("vercel") or claim.get("evidence")):
            raise SystemExit(f"verified claim has no evidence reference: {claim['id']}")

    print(f"reality claims valid: {len(claims)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
