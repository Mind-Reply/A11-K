# 🔄 CI/CD PIPELINE SETUP & TRACKING

**Automated build, test, and deployment workflows for all projects.**

---

## 📋 QUICK REFERENCE

| Pipeline | Trigger | Action | Target |
|----------|---------|--------|--------|
| **Build** | Any push | Build image, run tests | Docker registry |
| **Staging** | main branch push | Deploy to staging env | Vercel (staging) |
| **Production** | Release tag | Deploy to production | Vercel (prod) + Docker Hub |

---

## 🚀 GITHUB ACTIONS SETUP

### Step 1: Create `.github/workflows/docker-build.yml`

**This file runs on every git push:**

```yaml
name: Docker Build & Push

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: ${{ github.ref == 'refs/heads/main' }}
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/myapp:latest
            ${{ secrets.DOCKER_USERNAME }}/myapp:${{ github.sha }}
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/myapp:buildcache
          cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/myapp:buildcache,mode=max

  test:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref != 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Run tests
        run: docker run --rm ${{ secrets.DOCKER_USERNAME }}/myapp:${{ github.sha }} npm test
```

### Step 2: Add Docker Hub Secrets to GitHub

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add:
   - `DOCKER_USERNAME` = your Docker Hub username
   - `DOCKER_PASSWORD` = your Docker Hub access token (NOT password!)

**To get Docker Hub token:**
```bash
# 1. Go to https://hub.docker.com/settings/security
# 2. Create New Access Token
# 3. Copy token
# 4. Add to GitHub Secrets
```

### Step 3: Deploy to Staging (Vercel)

**Add to `.github/workflows/deploy-staging.yml`:**

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        run: |
          npx vercel --prod \
            --token=${{ secrets.VERCEL_TOKEN }} \
            --scope=${{ secrets.VERCEL_TEAM }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Get Vercel secrets:**
```bash
# VERCEL_TOKEN: https://vercel.com/account/tokens
# VERCEL_ORG_ID: vercel.json or CLI
# VERCEL_PROJECT_ID: vercel.json or CLI
```

---

## 📊 WORKFLOW STATUS TRACKING

### By Project

| Project | Build Pipeline | Test Pipeline | Deploy Pipeline | Status |
|---------|----------------|---------------|-----------------|--------|
| mind-reply-core-execution | ⏳ Pending | ⏳ Pending | ⏳ Pending | 🔴 Blocked |
| a11k-enterprise | ⏳ Pending | ⏳ Pending | ⏳ Pending | 🔴 Blocked |
| eu-ai-hub | ⏳ Pending | ⏳ Pending | ⏳ Pending | 🔴 Blocked |
| eu-market-gateway | ⏳ Pending | ⏳ Pending | ⏳ Pending | 🔴 Blocked |

---

## 🔍 TROUBLESHOOTING CI/CD

### Build fails in GitHub Actions but works locally

**Causes:**
- Different OS (GitHub uses Linux, you use Windows)
- Missing secrets
- .dockerignore excluding needed files

**Debug:**
```bash
# 1. Check logs in GitHub Actions
# → Repo → Actions → Last workflow → Failed job

# 2. Run locally with same command
docker build -f Dockerfile .

# 3. Compare .dockerignore between local and repo
# GitHub might use different one
```

### Docker push fails (auth error)

```bash
# ❌ ERROR: authentication required
```

**Fix:**
1. Check Docker Hub token is valid (not expired)
2. Update GitHub Secrets with new token
3. Test locally first:
   ```bash
   docker login -u $DOCKER_USERNAME
   docker push $DOCKER_USERNAME/myapp:latest
   ```

### Vercel deployment times out

**Cause:** Build takes too long (dependencies, bundling)

**Solutions:**
1. Use layer caching (see DOCKER_OPTIMIZATION_GUIDE.md)
2. Exclude devDependencies in production build
3. Pre-build Docker image, deploy only artifact

---

## 📈 PERFORMANCE METRICS

### Build Times (GitHub Actions)

| Project | First Build | Rebuild (cache hit) | Target |
|---------|------------|-------------------|--------|
| mind-reply-core | 8-10 min | 2-3 min | 1-2 min |
| a11k-enterprise | 6-8 min | 1-2 min | 1-2 min |
| eu-ai-hub | 3-4 min | 1 min | <1 min |

**Optimization:** Use Docker Build Cloud to parallelize builds

---

## 🔐 SECURITY BEST PRACTICES

### Secrets Management

```yaml
# ✅ CORRECT: Use GitHub Secrets
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}

# ❌ WRONG: Hardcoded secrets
env:
  DATABASE_URL: postgresql://user:pass@host/db
```

### Image Signing & Scanning

```yaml
# Add to GitHub Actions workflow:
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ secrets.DOCKER_USERNAME }}/myapp:latest
    format: 'sarif'
```

### Non-Root User in Dockerfile

```dockerfile
# ✅ SECURE: Run as non-root
RUN addgroup --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# ❌ INSECURE: Run as root
USER root
```

---

## 🎯 DEPLOYMENT STRATEGY

### Branch-based Deployment

```
develop → Build + Test only
main    → Build + Test + Push to registry + Deploy staging
release → Build + Test + Push to registry + Deploy production
```

### Rollback Procedure

```bash
# If production deployment fails:

# 1. Find last good version
docker images | grep myapp
# Pick previous tag

# 2. Redeploy previous version
docker pull myapp:v1.2.0
# Deploy or roll back on Vercel

# 3. Investigate failure
# Check: Vercel logs, Docker image, env variables
```

---

## 📋 SETUP CHECKLIST

- [ ] Create `.github/workflows/` directory in repo
- [ ] Add `docker-build.yml` workflow file
- [ ] Add `deploy-staging.yml` workflow file
- [ ] Get Docker Hub access token
- [ ] Get Vercel token + org/project IDs
- [ ] Add all secrets to GitHub
- [ ] Make a test push to main branch
- [ ] Verify GitHub Actions runs automatically
- [ ] Verify image appears in Docker Hub registry
- [ ] Verify deployment to Vercel staging
- [ ] Test rolling back to previous version

---

## 🚀 NEXT STEPS

1. **This week:** Set up GitHub Actions for mind-reply-core
2. **Next week:** Add to a11k-enterprise
3. **Week 3:** Set up for eu-ai-hub + eu-market-gateway
4. **Ongoing:** Monitor build times, optimize layer caching

---

*CI/CD Setup & Tracking — Phase 3 Infrastructure*  
*Last Updated: 2026-09-16*
