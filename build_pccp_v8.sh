import os
import zipfile
from pathlib import Path

REPO_NAME = "pccp-grid-v8"

FILES = {
    # ---------------- ROOT ----------------
    f"{REPO_NAME}/README.md": """# PCCP-GRID v8
Proof-Carrying Infrastructure Runtime (Production Scaffold)
""",

    # ---------------- API ----------------
    f"{REPO_NAME}/api/main.py": """
from fastapi import FastAPI

app = FastAPI()

STATE = {"proposals": []}

@app.get("/state")
def state():
    return STATE

@app.post("/proposal")
def proposal(p: dict):
    STATE["proposals"].append(p)
    return {"status": "received"}
""",

    # ---------------- SIMULATION ----------------
    f"{REPO_NAME}/simulation/engine.py": """
import random

def run_simulation(proposal):
    return {
        "latency": random.randint(20, 200),
        "cost": random.random(),
        "stable": random.random() > 0.15
    }
""",

    # ---------------- PROOF ENGINE ----------------
    f"{REPO_NAME}/proof/engine.py": """
class ProofEngine:

    def verify(self, proposal, sim):

        if not sim.get("stable"):
            return False

        if proposal.get("breaks_invariants"):
            return False

        if not proposal.get("hash"):
            return False

        return True
""",

    # ---------------- CRD ----------------
    f"{REPO_NAME}/crds/governance.yaml": """
apiVersion: pccp.io/v1
kind: GovernanceModel
metadata:
  name: active-model
spec:
  requiresProof: true
  allowMutation: false
""",

    # ---------------- DOCKER ----------------
    f"{REPO_NAME}/docker/operator.Dockerfile": """
FROM python:3.11
WORKDIR /app
COPY . .
CMD ["python", "-c", "print('operator running')"]
""",

    f"{REPO_NAME}/docker/api.Dockerfile": """
FROM python:3.11
WORKDIR /app
COPY api/ .
RUN pip install fastapi uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
""",

    # ---------------- K8S ----------------
    f"{REPO_NAME}/k8s/api.yaml": """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pccp-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: pccp/api:v8
""",

    # ---------------- HELM ----------------
    f"{REPO_NAME}/helm/Chart.yaml": """
apiVersion: v2
name: pccp-grid-v8
version: 0.8.0
""",

    # ---------------- CI/CD ----------------
    f"{REPO_NAME}/.github/workflows/ci.yml": """
name: PCCP v8 CI

on:
  push:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build API
        run: |
          docker build -f docker/api.Dockerfile -t pccp/api:v8 .
"""
}

# ---------------- FILE WRITER ----------------
def write_files():
    for path, content in FILES.items():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(content.strip())

# ---------------- ZIP EXPORT ----------------
def create_zip():
    zip_name = f"{REPO_NAME}.zip"

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(REPO_NAME):
            for file in files:
                full_path = os.path.join(root, file)
                arcname = os.path.relpath(full_path, REPO_NAME)
                zipf.write(full_path, os.path.join(REPO_NAME, arcname))

    print(f"[OK] ZIP CREATED → {zip_name}")

# ---------------- MAIN ----------------
if __name__ == "__main__":
    print("Building PCCP v8 repository...")

    write_files()

    print("Files generated.")

    create_zip()

    print("DONE — Ready for GitHub upload.")