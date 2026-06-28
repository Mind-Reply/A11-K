import os
import zipfile
from pathlib import Path

REPO = "pccp-grid-v9"

FILES = {

# ================= ROOT =================
f"{REPO}/README.md": """
PCCP-GRID v9 — Multi-Cloud Proof Federation

Features:
- AWS / Azure / GCP federation
- Proof synchronization layer
- GitOps reconciliation engine
- Kubernetes operator scaffold
""",

# ================= AWS =================
f"{REPO}/infra/aws.yaml": """
cluster: aws-eks
region: us-east-1
node_type: m5.large
federation: enabled
""",

# ================= AZURE =================
f"{REPO}/infra/azure.yaml": """
cluster: aks
region: westeurope
node_type: Standard_D4s_v5
federation: enabled
""",

# ================= GCP =================
f"{REPO}/infra/gcp.yaml": """
cluster: gke
region: europe-west1
node_type: n2-standard-4
federation: enabled
""",

# ================= FEDERATION ENGINE =================
f"{REPO}/federation/governance.py": """
class FederationGovernance:

    def score_cluster(self, cluster):
        return (
            cluster.get('proofs', 0) +
            cluster.get('stability', 0) +
            cluster.get('latency_score', 0)
        )

    def select_active(self, clusters):

        return max(clusters, key=self.score_cluster)
""",

# ================= PROOF SYNC =================
f"{REPO}/federation/sync.py": """
class ProofSync:

    def merge(self, clusters):
        proofs = set()

        for c in clusters.values():
            proofs.update(c.get('proofs', []))

        return list(proofs)
""",

# ================= ORCHESTRATOR =================
f"{REPO}/orchestrator/main.py": """
from federation.governance import FederationGovernance
from federation.sync import ProofSync

class Orchestrator:

    def reconcile(self, state):

        gov = FederationGovernance()
        sync = ProofSync()

        active = gov.select_active(state['clusters'])
        proofs = sync.merge(state['clusters'])

        return {
            "active_cluster": active,
            "global_proofs": proofs
        }
""",

# ================= GITOPS SYNC =================
f"{REPO}/gitops/sync.py": """
import subprocess

def sync():

    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", "federation sync v9"])
    subprocess.run(["git", "push"])
""",

# ================= K8S OPERATOR =================
f"{REPO}/k8s/operator.yaml": """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: federation-operator
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: operator
        image: pccp/federation:v9
""",

# ================= CRDS =================
f"{REPO}/crds/governance.yaml": """
apiVersion: pccp.io/v1
kind: GovernanceModel
metadata:
  name: federation-model
spec:
  multiCloud: true
  proofRequired: true
""",

# ================= HELM =================
f"{REPO}/helm/Chart.yaml": """
apiVersion: v2
name: pccp-grid-v9
version: 0.9.0
""",

# ================= CI/CD =================
f"{REPO}/.github/workflows/federation.yml": """
name: PCCP v9 Federation CI

on:
  push:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Validate Federation
        run: echo "validating multi-cloud state"

      - name: Sync GitOps
        run: echo "syncing clusters"
"""
}

# ================= WRITE FILES =================
def write_repo():
    for path, content in FILES.items():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(content.strip())

# ================= ZIP EXPORT =================
def zip_repo():
    zip_name = f"{REPO}.zip"

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(REPO):
            for file in files:
                full = os.path.join(root, file)
                arc = os.path.relpath(full, REPO)
                z.write(full, os.path.join(REPO, arc))

    print(f"ZIP CREATED: {zip_name}")

# ================= MAIN =================
if __name__ == "__main__":
    print("Building PCCP v9 federation repo...")

    write_repo()

    print("Repo generated.")

    zip_repo()

    print("DONE — Ready for GitHub upload")