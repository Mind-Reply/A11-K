import os
import zipfile
import subprocess

REPO = "pccp-v15"

FILES = {

# ---------------- BACKEND ----------------
f"{REPO}/backend/main.py": """
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"status": "PCCP v15 running"}
""",

f"{REPO}/backend/billing.py": """
def cost(cpu, mem):
    return cpu * 0.05 + mem * 0.01
""",

# ---------------- FRONTEND ----------------
f"{REPO}/frontend/App.jsx": """
export default function App() {
  return <h1>PCCP v15 SaaS Dashboard</h1>;
}
""",

# ---------------- DOCKER ----------------
f"{REPO}/docker/Dockerfile": """
FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install fastapi uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0"]
""",

# ---------------- TERRAFORM AWS ----------------
f"{REPO}/terraform/aws/main.tf": """
provider "aws" {
  region = "us-east-1"
}

module "eks" {
  source = "terraform-aws-modules/eks/aws"
  cluster_name = "pccp-v15"
}
""",

# ---------------- ARGOCD ----------------
f"{REPO}/argocd/app.yaml": """
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pccp-v15
spec:
  source:
    repoURL: https://github.com/YOUR_ORG/pccp-v15
    path: helm
""",

# ---------------- CI/CD ----------------
f"{REPO}/.github/workflows/ci.yml": """
name: PCCP CI

on:
  push:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: echo "CI running"
""",

# ---------------- DEPLOY SCRIPT ----------------
f"{REPO}/scripts/deploy_aws.sh": """
#!/bin/bash

echo "Deploying AWS EKS..."

terraform -chdir=terraform/aws init
terraform -chdir=terraform/aws apply -auto-approve

echo "Bootstrapping ArgoCD..."
kubectl apply -f argocd/app.yaml
""",

# ---------------- REPO CREATOR ----------------
f"{REPO}/scripts/create_repo.py": """
import requests

def create_repo(token, name):
    url = "https://api.github.com/user/repos"

    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json"
    }

    data = {
        "name": name,
        "auto_init": True
    }

    return requests.post(url, json=data, headers=headers).json()
""",

# ---------------- ZIP EXPORT ----------------
f"{REPO}/scripts/zip_export.py": """
import zipfile
import os

def zip_repo():
    name = "pccp-v15.zip"

    with zipfile.ZipFile(name, "w") as z:
        for root, _, files in os.walk("pccp-v15"):
            for f in files:
                path = os.path.join(root, f)
                arc = os.path.relpath(path, "pccp-v15")
                z.write(path, arc)

    print("ZIP CREATED:", name)

if __name__ == "__main__":
    zip_repo()
"""
}

# ---------------- WRITE FILES ----------------
def write():
    for path, content in FILES.items():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(content.strip())

# ---------------- ZIP ----------------
def zip_repo():
    zip_name = f"{REPO}.zip"

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(REPO):
            for file in files:
                full = os.path.join(root, file)
                arc = os.path.relpath(full, REPO)
                z.write(full, os.path.join(REPO, arc))

    print("ZIP CREATED:", zip_name)

# ---------------- MAIN ----------------
if __name__ == "__main__":

    print("Generating PCCP v15 repo...")

    write()

    zip_repo()

    print("DONE → repo + zip ready")