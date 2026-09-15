# 🔄 MULTI-REPO SYNCHRONIZATION & PLATFORM ALIGNMENT PLAN

**Unified execution strategy across 7 GitHub repositories**  
**Status:** Analysis Complete → Ready for Synchronization  
**Target:** Single orchestrated deployment

---

## 📊 CURRENT STATE ANALYSIS

### Repository Status Matrix

| Repo | Remote | Branch | Status | Docker | Compose.prod | Type | Priority |
|------|--------|--------|--------|--------|--------------|------|----------|
| **mind-reply-core-execution** | ✅ angellllkr-eng | chore/go-live-security | 🔴 DIRTY | ✅ YES | ✅ YES | Next.js | 🔴 P1 |
| **mind-reply-core-inspect** | ✅ angellllkr-eng | main | 🟢 CLEAN | ❓ ? | ❓ ? | Next.js | 🟡 P2 |
| **a11k-enterprise** | ❌ LOCAL ONLY | master | 🔴 DIRTY | ✅ YES | ❌ NO | Next.js | 🔴 P1 |
| **a11k-repo** (sofia-ledger) | ✅ Mind-Reply/A11-K | main | 🔴 DIRTY | ✅ YES | ❌ NO | Next.js | 🟡 P2 |
| **a11k-unified** | ❌ LOCAL ONLY | master | 🔴 DIRTY | ❓ ? | ❌ NO | Unknown | 🔴 P3 |
| **eu-ai-hub** | ✅ YOUR_USERNAME | main | 🔴 DIRTY | ✅ YES | ❌ NO | Node/Client | 🟡 P2 |
| **eu-market-gateway** | ❌ LOCAL ONLY | master | 🟢 CLEAN | ❓ ? | ❌ NO | Node | 🟡 P2 |

### Key Issues Identified

🔴 **Critical (Block Deployment):**
1. **a11k-enterprise** — No remote configured (LOCAL ONLY)
2. **a11k-unified** — No commits, broken state
3. **Dirty repos** — Uncommitted changes (4/7 repos have untracked files)

🟡 **Medium (Prevent CI/CD):**
1. Only 1 repo has production compose file (mind-reply-core)
2. Branch strategy inconsistent (chore/go-live vs main vs master)
3. Some repos missing GitHub remotes

🟢 **Low (Organizational):**
1. No unified docker-compose orchestration
2. No synchronized CI/CD across platforms
3. Monorepo structure unclear

---

## 🎯 SYNCHRONIZATION STRATEGY

### Phase 1: Fix Git & Remotes (TODAY — 1 hour)

#### 1.1 Commit Dirty Repos

```bash
# For each dirty repo:
cd C:\Users\Mindr\<repo>
git status
git add .
git commit -m "chore: sync state before platform alignment"
git push origin <branch>
```

**Repos to fix:**
- mind-reply-core-execution (branch: chore/go-live-security-cleanup)
- a11k-enterprise (missing remote)
- a11k-repo (branch: main)
- eu-ai-hub (branch: main)

#### 1.2 Add Missing Remotes

```bash
# a11k-enterprise (create on GitHub first)
cd C:\Users\Mindr\a11k-enterprise
git remote add origin https://github.com/angellllkr-eng/a11k-enterprise.git
git branch -M main
git push -u origin main

# a11k-unified (fix broken state)
cd C:\Users\Mindr\a11k-unified
git init
git add .
git commit -m "Initial commit - A11K Unified Platform"
git remote add origin https://github.com/angellllkr-eng/a11k-unified.git
git branch -M main
git push -u origin main

# eu-market-gateway (add remote if missing)
cd C:\Users\Mindr\eu-market-gateway
git remote add origin https://github.com/angellllkr-eng/eu-market-gateway.git
git push -u origin main
```

#### 1.3 Standardize Branches

```bash
# All repos should be on main (or develop for monorepo)
cd C:\Users\Mindr\mind-reply-core-execution
git checkout -b go-live/security-cleanup  # Keep feature branch
git branch -M main  # Then rebase main

# Others already on main or master → keep master for now, create main
```

---

### Phase 2: Unified Docker Configuration (2 hours)

#### 2.1 Create Production Compose Files

**All repos need docker-compose.prod.yml:**

```yaml
# docker-compose.prod.yml (for all Next.js repos)
version: '3.9'

services:
  app:
    image: ${REGISTRY}/${REPO}:${VERSION}
    container_name: ${REPO}-prod
    ports:
      - "${PORT}:${PORT}"
    environment:
      NODE_ENV: production
      NEXT_TELEMETRY_DISABLED: 1
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
    networks:
      - prod-network
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${PORT}/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G

networks:
  prod-network:
    driver: bridge
    name: prod-network

volumes:
  pg-data:
    driver: local
  redis-data:
    driver: local
```

**Repos needing this:**
- a11k-enterprise
- a11k-repo (sofia-tech-ledger)
- eu-ai-hub (client + server)
- eu-market-gateway

#### 2.2 Update All Dockerfiles to Use Multi-Stage Pattern

**Current state:** mind-reply-core has good multi-stage  
**Action:** Copy pattern to all others

```dockerfile
# Standardized pattern for ALL repos
FROM node:26-alpine AS deps
WORKDIR /app
RUN npm install -g pnpm@10.32.1
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

FROM node:26-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@10.32.1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm run build

FROM node:26-alpine AS runner
WORKDIR /app
RUN addgroup --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health')"
CMD ["pnpm", "start"]
```

#### 2.3 Add .dockerignore to All Repos

```
node_modules
.next
.git
.gitignore
README.md
.env
.env.local
tests/
dist/
coverage/
.vscode/
.idea/
*.log
.DS_Store
pnpm-debug.log*
```

---

### Phase 3: Unified CI/CD Pipeline (3 hours)

#### 3.1 GitHub Actions Workflow (for all repos)

**File: `.github/workflows/docker-ci-cd.yml`**

```yaml
name: Docker CI/CD Pipeline

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
  release:
    types: [published]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: |
            ${{ secrets.DOCKER_USERNAME }}/${{ github.event.repository.name }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: ${{ github.ref == 'refs/heads/main' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/${{ github.event.repository.name }}:buildcache
          cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/${{ github.event.repository.name }}:buildcache,mode=max

  test:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'pull_request'
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm run test --if-present

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build, test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (staging)
        run: |
          npx vercel deploy \
            --token=${{ secrets.VERCEL_TOKEN }} \
            --scope=${{ secrets.VERCEL_TEAM }}

  deploy-production:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.event_name == 'release'
    
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        run: |
          npx vercel deploy --prod \
            --token=${{ secrets.VERCEL_TOKEN }} \
            --scope=${{ secrets.VERCEL_TEAM }}
```

**Deploy to all 7 repos.**

---

### Phase 4: Monorepo Orchestration (4 hours)

#### 4.1 Create Root docker-compose.yml (Unified Orchestration)

**Location:** `C:\Users\Mindr\docker-compose.platform.yml`

```yaml
version: '3.9'

services:
  # P1: mind-reply-core (main product)
  mind-reply-web:
    build:
      context: ./mind-reply-core-execution
      dockerfile: Dockerfile
    container_name: mind-reply-web-prod
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_KEY: ${SUPABASE_KEY}
    networks:
      - platform-network
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      - postgres
      - redis
    labels:
      - "platform=mind-reply"
      - "tier=p1"

  # P1: a11k-enterprise (admin console)
  a11k-enterprise:
    build:
      context: ./a11k-enterprise
      dockerfile: Dockerfile
    container_name: a11k-enterprise-prod
    ports:
      - "3001:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
    networks:
      - platform-network
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      - postgres
    labels:
      - "platform=a11k"
      - "tier=p1"

  # P2: sofia-tech-ledger (analytics)
  sofia-tech-ledger:
    build:
      context: ./a11k-repo
      dockerfile: Dockerfile
    container_name: sofia-tech-ledger-prod
    ports:
      - "3002:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
    networks:
      - platform-network
    restart: always
    depends_on:
      - postgres
    labels:
      - "platform=sofia"
      - "tier=p2"

  # P2: EU AI Hub (market intelligence)
  eu-ai-hub:
    build:
      context: ./eu-ai-hub
      dockerfile: Dockerfile
    container_name: eu-ai-hub-prod
    ports:
      - "3003:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
    networks:
      - platform-network
    restart: always
    depends_on:
      - postgres
      - redis
    labels:
      - "platform=eu-ai"
      - "tier=p2"

  # P2: EU Market Gateway (routing)
  eu-market-gateway:
    build:
      context: ./eu-market-gateway
      dockerfile: Dockerfile
    container_name: eu-market-gateway-prod
    ports:
      - "3004:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
    networks:
      - platform-network
    restart: always
    depends_on:
      - postgres
      - redis
    labels:
      - "platform=eu-gateway"
      - "tier=p2"

  # Shared Infrastructure
  postgres:
    image: postgres:16-alpine
    container_name: platform-postgres
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: platform-prod
    volumes:
      - pg-data:/var/lib/postgresql/data
    networks:
      - platform-network
    restart: always
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: platform-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - platform-network
    restart: always
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Monitoring & Logging
  nginx:
    image: nginx:alpine
    container_name: platform-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - platform-network
    restart: always
    depends_on:
      - mind-reply-web
      - a11k-enterprise
      - sofia-tech-ledger
      - eu-ai-hub
      - eu-market-gateway

networks:
  platform-network:
    driver: bridge
    name: platform-network

volumes:
  pg-data:
    driver: local
  redis-data:
    driver: local
```

#### 4.2 Create nginx.conf for Unified Routing

```nginx
upstream mind_reply {
  server mind-reply-web:3000;
}

upstream a11k_enterprise {
  server a11k-enterprise:3000;
}

upstream sofia_ledger {
  server sofia-tech-ledger:3000;
}

upstream eu_ai_hub {
  server eu-ai-hub:3000;
}

upstream eu_gateway {
  server eu-market-gateway:3000;
}

server {
  listen 80;
  server_name localhost;

  # mind-reply.local
  location / {
    proxy_pass http://mind_reply;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # admin.mind-reply.local
  location /admin {
    proxy_pass http://a11k_enterprise;
  }

  # ledger.mind-reply.local
  location /ledger {
    proxy_pass http://sofia_ledger;
  }

  # ai-hub.mind-reply.local
  location /ai-hub {
    proxy_pass http://eu_ai_hub;
  }

  # gateway.mind-reply.local
  location /gateway {
    proxy_pass http://eu_gateway;
  }

  # Health check endpoint
  location /platform/health {
    access_log off;
    return 200 "platform-healthy";
  }
}
```

---

## 🚀 EXECUTION PLAN (This Week)

### Monday: Git & Remotes (1 hour)

```bash
# Task 1: Commit all dirty repos
cd C:\Users\Mindr\mind-reply-core-execution && git add . && git commit -m "chore: sync" && git push
cd C:\Users\Mindr\a11k-repo && git add . && git commit -m "chore: sync" && git push
cd C:\Users\Mindr\eu-ai-hub && git add . && git commit -m "chore: sync" && git push

# Task 2: Fix remotes
cd C:\Users\Mindr\a11k-enterprise && git remote add origin https://github.com/angellllkr-eng/a11k-enterprise.git
cd C:\Users\Mindr\a11k-enterprise && git branch -M main && git push -u origin main

# Task 3: Fix a11k-unified
cd C:\Users\Mindr\a11k-unified && git init && git add . && git commit -m "Initial"
cd C:\Users\Mindr\a11k-unified && git remote add origin https://github.com/angellllkr-eng/a11k-unified.git
cd C:\Users\Mindr\a11k-unified && git branch -M main && git push -u origin main
```

### Tuesday-Wednesday: Docker Configuration (2 hours)

- [ ] Add docker-compose.prod.yml to a11k-enterprise
- [ ] Add docker-compose.prod.yml to a11k-repo
- [ ] Add docker-compose.prod.yml to eu-ai-hub
- [ ] Add docker-compose.prod.yml to eu-market-gateway
- [ ] Add .dockerignore to all
- [ ] Standardize all Dockerfiles (multi-stage pattern)

### Thursday: CI/CD Setup (1.5 hours)

- [ ] Add `.github/workflows/docker-ci-cd.yml` to all 7 repos
- [ ] Configure GitHub secrets (Docker Hub, Vercel, Database)
- [ ] Test: Push to main branch → Watch CI/CD run

### Friday: Unified Orchestration (2 hours)

- [ ] Create `docker-compose.platform.yml` in root
- [ ] Create `nginx.conf` for unified routing
- [ ] Create `.env.platform` template
- [ ] Test: `docker compose -f docker-compose.platform.yml up --pull always`

---

## 📋 FILES TO CREATE/UPDATE

### Per Repository (7x)

```
Each repo needs:
├── .github/workflows/docker-ci-cd.yml      (NEW)
├── Dockerfile                              (UPDATE to multi-stage)
├── docker-compose.yml                      (VERIFY)
├── docker-compose.prod.yml                 (NEW)
└── .dockerignore                           (NEW)
```

### Root Directory

```
C:\Users\Mindr\
├── docker-compose.platform.yml             (NEW)
├── nginx.conf                              (NEW)
├── .env.platform.example                   (NEW)
└── PLATFORM_ORCHESTRATION_GUIDE.md         (NEW)
```

---

## 🎯 SYNCHRONIZED DEPLOYMENT TARGETS

**After Implementation:**

| Service | Local | Staging | Production |
|---------|-------|---------|------------|
| mind-reply-web | localhost:3000 | mind-reply-staging.vercel.app | mind-reply.com |
| a11k-enterprise | localhost:3001 | a11k-admin-staging.vercel.app | admin.mind-reply.com |
| sofia-tech-ledger | localhost:3002 | sofia-staging.vercel.app | sofia.mind-reply.com |
| eu-ai-hub | localhost:3003 | eu-ai-staging.vercel.app | eu-ai.mind-reply.com |
| eu-market-gateway | localhost:3004 | eu-gateway-staging.vercel.app | eu-gateway.mind-reply.com |

**Database & Cache (Shared):**
- Postgres: platform-postgres (Docker) / Supabase (Production)
- Redis: platform-redis (Docker) / ElastiCache (Production)

---

## ✅ SUCCESS CRITERIA

- [ ] All 7 repos on GitHub with remotes configured
- [ ] All repos on `main` branch
- [ ] All repos have Dockerfile, docker-compose.yml, .dockerignore
- [ ] All repos have docker-compose.prod.yml
- [ ] All repos have GitHub Actions workflow configured
- [ ] Root `docker-compose.platform.yml` works locally
- [ ] `docker compose -f docker-compose.platform.yml up` starts all 5 services + postgres + redis
- [ ] Can access all services through nginx proxy (localhost routing)
- [ ] All health checks passing

---

**Synchronization Plan Complete. Ready to Execute.**

---

*Multi-Repo Synchronization Strategy — Unified Platform Deployment*  
*Created: 2026-09-16*
