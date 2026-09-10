#!/usr/bin/env bash
# A11-K / MindReply Sofia Node — Layer 2 local reasoning launcher
# Runs on the private workstation only. It does not expose the model publicly.
# Hardware target: NVIDIA RTX PRO 6000 Blackwell + AMD Threadripper.
set -euo pipefail

export CUDA_DEVICE_ORDER="PCI_BUS_ID"
export CUDA_VISIBLE_DEVICES="0"
export OMP_NUM_THREADS="16"
export NCCL_DEBUG="WARN"

MODEL_PATH="${A11K_L2_MODEL_PATH:-/opt/models/mindreply-core-reasoning}"
PORT="${A11K_L2_PORT:-8000}"
GPU_MEMORY_UTILIZATION="${A11K_L2_GPU_MEMORY_UTILIZATION:-0.85}"
MAX_MODEL_LEN="${A11K_L2_MAX_MODEL_LEN:-8192}"
AUDIT_LOG_DIR="${A11K_L2_AUDIT_LOG_DIR:-/mnt/nvme_array/compliance_logs}"
INFERENCE_CORES="${A11K_L2_CPU_CORES:-25-48}"
LOG_CONFIG="${A11K_L2_LOG_CONFIG:-/opt/config/vllm_logging.json}"

printf '[%s] Initializing A11-K Layer 2...\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

command -v nvidia-smi >/dev/null 2>&1 || { echo 'FAILED: nvidia-smi not found' >&2; exit 1; }
command -v taskset >/dev/null 2>&1 || { echo 'FAILED: taskset not found' >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo 'FAILED: python3 not found' >&2; exit 1; }

GPU_NAME="$(nvidia-smi --query-gpu=name --format=csv,noheader | head -n 1)"
printf '[%s] GPU: %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$GPU_NAME"

if [[ ! -d "$MODEL_PATH" ]]; then
  echo "FAILED: model path does not exist: $MODEL_PATH" >&2
  exit 1
fi

mkdir -p "$AUDIT_LOG_DIR"
export AI_ACT_LOG_PATH="$AUDIT_LOG_DIR/eu_compliance_$(date +%Y%m%d).jsonl"

# Do not change GPU clock/boost policy automatically. Those settings are host-policy
# controls and must be applied separately after hardware/driver verification.

printf '[%s] Binding Layer 2 to CPU cores %s on port %s...\n' \
  "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$INFERENCE_CORES" "$PORT"

taskset -c "$INFERENCE_CORES" python3 -m vllm.entrypoints.openai.api_server \
  --model "$MODEL_PATH" \
  --gpu-memory-utilization "$GPU_MEMORY_UTILIZATION" \
  --max-model-len "$MAX_MODEL_LEN" \
  --port "$PORT" \
  --enforce-eager \
  ${LOG_CONFIG:+--log-config "$LOG_CONFIG"} \
  >> "$AUDIT_LOG_DIR/engine_runtime.log" 2>&1 &

ENGINE_PID=$!
printf '[%s] Layer 2 process started: PID=%s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$ENGINE_PID"
printf '[%s] Local endpoint: http://127.0.0.1:%s/v1\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$PORT"
