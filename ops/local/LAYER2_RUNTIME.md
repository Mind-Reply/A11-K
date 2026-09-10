# A11-K Layer 2 Runtime

## Role

The private Sofia workstation is the execution host for local reasoning. GitHub/Vercel remain the control-plane and web surfaces; the local GPU runtime is not deployed inside Vercel.

## Start

Run on the workstation:

```bash
./ops/local/init_layer2_engine.sh
```

Optional environment overrides:

- `A11K_L2_MODEL_PATH`
- `A11K_L2_PORT`
- `A11K_L2_GPU_MEMORY_UTILIZATION`
- `A11K_L2_MAX_MODEL_LEN`
- `A11K_L2_AUDIT_LOG_DIR`
- `A11K_L2_CPU_CORES`
- `A11K_L2_LOG_CONFIG`

## Verification

1. Confirm `nvidia-smi` sees the intended GPU.
2. Confirm the model directory exists.
3. Confirm the process is listening only on the intended local interface/port.
4. Check `/mnt/nvme_array/compliance_logs/engine_runtime.log`.
5. Smoke-test the OpenAI-compatible `/v1` endpoint locally.

## Boundary

No public ingress is enabled by this launcher. A remote control-plane connection requires a separately authenticated, least-privilege bridge/tunnel and must never expose the model server directly to the internet.

## Hardware policy

GPU clock/boost changes are intentionally not performed by the launcher. Driver-level performance policy must be verified against the actual Blackwell workstation before applying host-wide changes.
