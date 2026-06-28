import os
import zipfile

LOCAL = "pccp-local-v12"
SAAS = "pccp-saas-v12"

# -----------------------------
# FILE DEFINITIONS (LOCAL)
# -----------------------------
LOCAL_FILES = {
f"{LOCAL}/frontend/App.jsx": """
export default function App() {
  return <h1>PCCP Local v12</h1>;
}
""",

f"{LOCAL}/backend/main.py": """
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "local-ok"}
""",

f"{LOCAL}/operator/main.go": """
package main
import "fmt"

func main() {
    fmt.Println("Local Operator Running")
}
""",

f"{LOCAL}/docker/docker-compose.yml": """
version: '3.9'
services:
  api:
    build: ../backend
    ports:
      - "8000:8000"

  ui:
    build: ../frontend
    ports:
      - "3000:3000"
"""
}

# -----------------------------
# FILE DEFINITIONS (SAAS AWS)
# -----------------------------
SAAS_FILES = {
f"{SAAS}/terraform/aws/main.tf": """
provider "aws" {
  region = "us-east-1"
}

module "eks" {
  source = "terraform-aws-modules/eks/aws"
  cluster_name = "pccp-v12"
}
""",

f"{SAAS}/terraform/aws/iam.tf": """
resource "aws_iam_role" "eks_role" {
  name = "pccp-v12-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "eks.amazonaws.com" },
      Action = "sts:AssumeRole"
    }]
  })
}
""",

f"{SAAS}/argocd/bootstrap.yaml": """
apiVersion: v1
kind: Namespace
metadata:
  name: argocd
""",

f"{SAAS}/argocd/app.yaml": """
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pccp-v12
spec:
  source:
    repoURL: https://github.com/YOUR_ORG/pccp-v12
    path: helm
  destination:
    server: https://kubernetes.default.svc
""",

f"{SAAS}/backend/main.py": """
from fastapi import FastAPI

app = FastAPI()

TENANTS = {}

@app.post("/tenant")
def create(t: dict):
    TENANTS[t["id"]] = t
    return t
""",

f"{SAAS}/helm/chart.yaml": """
apiVersion: v2
name: pccp-v12
version: 1.0.0
""",

f"{SAAS}/ci/github-actions.yml": """
name: PCCP SaaS CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: echo "SAAS PIPELINE OK"
"""
}

# -----------------------------
# WRITE FILES
# -----------------------------
def write_files(files):
    for path, content in files.items():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(content.strip())

# -----------------------------
# ZIP BUILDER
# -----------------------------
def zip_folder(folder):
    zip_name = f"{folder}.zip"

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(folder):
            for file in files:
                full = os.path.join(root, file)
                arc = os.path.relpath(full, folder)
                z.write(full, os.path.join(folder, arc))

    print(f"[OK] Created {zip_name}")

# -----------------------------
# MAIN
# -----------------------------
if __name__ == "__main__":

    print("Building LOCAL repo...")
    write_files(LOCAL_FILES)

    print("Building SAAS repo...")
    write_files(SAAS_FILES)

    print("Zipping LOCAL...")
    zip_folder(LOCAL)

    print("Zipping SAAS...")
    zip_folder(SAAS)

    print("\nDONE:")
    print(" - pccp-local-v12.zip")
    print(" - pccp-saas-v12.zip")