#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"
PID_FILE="${PID_FILE:-/mnt/nvme_array/compliance_logs/layer2.pid}"

if ! command -v curl >/dev/null 2>&1; then
  echo "FAILED: curl not installed" >&2
  exit 1
fi

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE")"
  if ! kill -0 "$PID" 2>/dev/null; then
    echo "FAILED: Layer 2 PID $PID is not running"
    exit 1
  fi
else
  echo "FAILED: PID file missing: $PID_FILE"
  exit 1
fi

HTTP_CODE="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 "http://127.0.0.1:${PORT}/health")"
if [[ "$HTTP_CODE" == "200" ]]; then
  echo "VERIFIED: Layer 2 healthy on 127.0.0.1:${PORT}"
else
  echo "FAILED: Layer 2 health returned HTTP ${HTTP_CODE}"
  exit 1
fi
