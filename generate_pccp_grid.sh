#!/bin/bash

set -e

PROJECT="pccp-grid-enterprise"

echo "Creating $PROJECT ..."

mkdir -p $PROJECT

cd $PROJECT

# =========================
# ROOT FILES
# =========================

cat <<EOF > README.md
# PCCP-GRID Enterprise

Multi-cloud federation system:
AWS + Azure + GCP + Kubernetes + Istio + ArgoCD + Zero Trust Security
EOF

cat <<EOF > bootstrap.sh
#!/bin/bash
set -e

bash terraform/aws/deploy.sh
bash terraform/azure/deploy.sh
bash terraform/gcp/deploy.sh

kubectl apply -f k8s/base
kubectl apply -f gitops/
EOF

chmod +x bootstrap.sh

# =========================
# TERRAFORM STRUCTURE
# =========================

mkdir -p terraform/aws terraform/azure terraform/gcp terraform/global

cat <<EOF > terraform/aws/main.tf
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  cluster_name = "pccp-aws"
  cluster_version = "1.29"
}
EOF

cat <<EOF > terraform/azure/main.tf
resource "azurerm_kubernetes_cluster" "aks" {
  name = "pccp-aks"
  location = "West Europe"
}
EOF

cat <<EOF > terraform/gcp/main.tf
resource "google_container_cluster" "gke" {
  name = "pccp-gke"
  location = "europe-west1"
}
EOF

# =========================
# KUBERNETES BASE
# =========================

mkdir -p k8s/base k8s/policies

cat <<EOF > k8s/base/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: pccp-grid
EOF

cat <<EOF > k8s/base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scheduler
spec:
  replicas: 2
  selector:
    matchLabels:
      app: scheduler
  template:
    metadata:
      labels:
        app: scheduler
    spec:
      containers:
      - name: scheduler
        image: pccp-grid/scheduler:latest
EOF

# =========================
# GITOPS
# =========================

mkdir -p gitops

cat <<EOF > gitops/app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pccp-grid
spec:
  source:
    repoURL: https://github.com/your/repo
    path: k8s/base
  destination:
    namespace: pccp-grid
EOF

# =========================
# SECURITY STACK
# =========================

mkdir -p security/opa security/falco security/cosign

cat <<EOF > security/opa/policy.rego
package policy

default allow = false

allow {
  input.identity.valid == true
}
EOF

cat <<EOF > security/falco/rule.yaml
- rule: container anomaly
  condition: container
  output: alert
  priority: CRITICAL
EOF

# =========================
# DIAGRAMS
# =========================

mkdir -p diagrams

cat <<EOF > diagrams/global.txt
AWS <-> AZURE <-> GCP
via VPN / Interconnect mesh
Istio service mesh over all clusters
EOF

# =========================
# CI/CD
# =========================

mkdir -p .github/workflows

cat <<EOF > .github/workflows/deploy.yml
name: deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - run: echo "Deploy pipeline"
EOF

# =========================
# INSTALL SCRIPTS
# =========================

mkdir -p scripts

cat <<EOF > scripts/install_argocd.sh
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
EOF

cat <<EOF > scripts/install_istio.sh
echo "install istio"
EOF

cat <<EOF > scripts/install_security.sh
kubectl apply -f security/
EOF

# =========================
# ZIP OUTPUT
# =========================

cd ..

zip -r ${PROJECT}.zip ${PROJECT}

echo "DONE -> ${PROJECT}.zip created"