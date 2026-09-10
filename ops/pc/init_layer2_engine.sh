#!/usr/bin/env bash
# A11-K / MindReply — MegaAgent PC Studio
# Layer 2 local reasoning engine launcher.
# This file is installed/executed on the private workstation, never by Vercel.
set -euo pipefail

MODEL_DIR="${MODEL_DIR:-/opt/models/mindreply-core-reasoning}"
PORT="${PORT:-8000}"
AUDIT_LOG_DIR="${AUDIT_LOG_DIR:-/mnt/nvme_array/compliance_logs}"
INFERENCE_CORES="${INFERENCE_CORES:-25-48}"
GPU_MEMORY_UTILIZATION="${GPU_MEMORY_UTILIZATION:-0.85}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-8192}"

export CUDA_DEVICE_ORDER="PCI_BUS_ID"
export CUDA_VISIBLE_DEVICES="${CUDA_VISIBLE_DEVICES:-0}"
export OMP_NUM_THREADS="${OMP_NUM_THREADS:-16}"
export NCCL_DEBUG="${NCCL_DEBUG:-WARN}"

log() { printf '[%s] %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*"; }
fatal() { log "ERROR: $*" >&2; exit 1; }

command -v nvidia-smi >/dev/null 2>&1 || fatal "nvidia-smi not detected; NVIDIA driver/runtime is not ready."
command -v python3 >/dev/null 2>&1 || fatal "python3 not detected."
command -v taskset >/dev/null 2>&1 || fatal "taskset not detected."
[[ -d "$MODEL_DIR" ]] || fatal "model directory missing: $MODEL_DIR"
[[ -r "$MODEL_DIR" ]] || fatal "model directory is not readable: $MODEL_DIR"

GPU_NAME="$(nvidia-smi --query-gpu=name --format=csv,noheader | head -n 1 | xargs)"
GPU_CC="$(nvidia-smi --query-gpu=compute_cap --format=csv,noheader 2>/dev/null | head -n 1 | xargs || true)"
log "Target GPU: ${GPU_NAME:-unknown}"
log "Compute capability: ${GPU_CC:-unknown}"

# Persistence mode is useful on the dedicated private node, but changing GPU
# policy is optional. Do not fail the engine merely because sudo is unavailable.
if command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
  sudo -n nvidia-smi -i 0 --persistence-mode=1 || log "WARN: persistence-mode change was not applied."
else
  log "WARN: passwordless sudo unavailable; leaving GPU policy unchanged."
fi

mkdir -p "$AUDIT_LOG_DIR"
export AI_ACT_LOG_PATH="${AI_ACT_LOG_PATH:-$AUDIT_LOG_DIR/eu_compliance_$(date +%Y%m%d).jsonl}"
RUNTIME_LOG="$AUDIT_LOG_DIR/engine_runtime.log"

python3 - <<'PY'
import importlib.util
for name in ('vllm',):
    if importlib.util.find_spec(name) is None:
        raise SystemExit(f'ERROR: required Python package not installed: {name}')
PY

if taskset -pc $$ >/dev/null 2>&1; then
  log "Binding Layer 2 worker to CPU cores ${INFERENCE_CORES}."
else
  fatal "CPU affinity is unavailable."
fi

log "Launching vLLM on 127.0.0.1:${PORT}; model=${MODEL_DIR}"
nohup taskset -c "$INFERENCE_CORES" \
  python3 -m vllm.entrypoints.openai.api_server \
  --model "$MODEL_DIR" \
  --gpu-memory-utilization "$GPU_MEMORY_UTILIZATION" \
  --max-model-len "$MAX_MODEL_LEN" \
  --host 127.0.0.1 \
  --port "$PORT" \
  --enforce-eager \
  >> "$RUNTIME_LOG" 2>&1 &

ENGINE_PID=$!
printf '%s\n' "$ENGINE_PID" > "$AUDIT_LOG_DIR/layer2.pid"
log "Layer 2 process started: PID ${ENGINE_PID}"
log "Health endpoint: http://127.0.0.1:${PORT}/health"
