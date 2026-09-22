# A11-K → ResellerPro runtime contract

This directory defines the handoff from the canonical A11-K repository to the owner-controlled ResellerPro runtime.

- Artifact: OCI container built from the repository Dockerfile
- Container health: GET /healthz
- Default container port: 8080
- Registry transport: GitHub Container Registry
- Production execution: ResellerPro / owner-controlled host
- Secrets: supplied by the runtime, never committed

GitHub is the source/evidence layer. ResellerPro is the execution/deployment layer.

A release is only reported as deployed after the target host returns HTTP 200 from the configured health endpoint. A successful image build or workflow run is not live deployment evidence.

Configure these GitHub Actions secrets only when the owner-controlled target is ready:
- RESELLERPRO_SSH_HOST
- RESELLERPRO_SSH_USER
- RESELLERPRO_SSH_PRIVATE_KEY
- RESELLERPRO_DEPLOY_PATH

If they are absent, the release builds and verifies the artifact but does not claim production deployment.

The current A11-K container exposes /healthz → HTTP 200 JSON when healthy.