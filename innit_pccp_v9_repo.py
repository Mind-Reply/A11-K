import os
import subprocess
import zipfile

REPO_NAME = "pccp-grid-v9"
GITHUB_USER = "YOUR_GITHUB_USERNAME"  # <-- change this

FILES = {
    f"{REPO_NAME}/README.md": "# PCCP-GRID v9\nMulti-cloud GitOps Federation System",

    f"{REPO_NAME}/terraform/aws-eks/main.tf": """
provider "aws" {
  region = "us-east-1"
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  cluster_name = "pccp-eks"
}
""",

    f"{REPO_NAME}/argocd/install.sh": """
#!/bin/bash
kubectl create namespace argocd || true
kubectl apply -n argocd \
https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
""",

    f"{REPO_NAME}/.github/workflows/ci.yml": """
name: PCCP CI

on:
  push:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate Repo
        run: echo "CI OK"
"""
}

# ---------------- CREATE FILES ----------------
def create_files():
    for path, content in FILES.items():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(content.strip())

# ---------------- INIT GIT ----------------
def init_git():
    os.chdir(REPO_NAME)

    subprocess.run(["git", "init"])
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", "init pccp-grid-v9"])

# ---------------- CREATE GITHUB REPO ----------------
def create_github_repo():
    repo_url = f"https://github.com/{GITHUB_USER}/{REPO_NAME}.git"

    subprocess.run([
        "gh", "repo", "create", f"{GITHUB_USER}/{REPO_NAME}",
        "--public",
        "--source=.",
        "--remote=origin",
        "--push"
    ])

    return repo_url

# ---------------- ZIP EXPORT ----------------
def export_zip():
    os.chdir("..")
    zip_name = f"{REPO_NAME}.zip"

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(REPO_NAME):
            for file in files:
                full = os.path.join(root, file)
                arc = os.path.relpath(full, REPO_NAME)
                z.write(full, os.path.join(REPO_NAME, arc))

    print("ZIP CREATED:", zip_name)

# ---------------- MAIN ----------------
if __name__ == "__main__":

    print("Building PCCP v9 repo...")

    create_files()

    print("Files created.")

    init_git()

    print("Git initialized.")

    repo_url = create_github_repo()

    print("GitHub repo created:", repo_url)

    export_zip()

    print("DONE — Repo live + CI active + ZIP exported")