# 🐳 DOCKER OPTIMIZATION & TROUBLESHOOTING GUIDE

**Comprehensive reference for building, debugging, and optimizing Docker images across all projects.**

---

## 📊 QUICK REFERENCE

| Issue | Symptom | Solution |
|-------|---------|----------|
| Build fails | `Error: COPY failed` | Check file exists: `ls -la` |
| Build slow | Takes 5+ minutes | Add `.dockerignore` to exclude node_modules |
| Image large | >500MB | Use multi-stage build, exclude devDeps |
| Port not accessible | `connection refused` | Check `docker ps` port mappings |
| Container exits | `docker ps -a` shows Exited | Check `docker logs <container>` |

---

## 🚀 TIER 1: NEXT.JS BUILD OPTIMIZATION

### Problem: Next.js builds are 200MB+ and take 5+ minutes

**Solution: Multi-Stage Build with Layer Caching**

```dockerfile
# ✅ OPTIMIZED - Use this pattern for ALL Next.js projects

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
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

FROM node:26-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm@10.32.1
RUN addgroup --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
CMD ["pnpm", "start"]
```

### Create .dockerignore

```
# Exclude these from COPY — saves build time + image size
node_modules
.next
.git
.gitignore
README.md
.env
.env.local
.env.*.local
tests/
dist/
coverage/
.vscode/
.idea/
*.log
.DS_Store
```

### Layer Caching Strategy

Each `RUN` command creates a layer. Order matters:

```dockerfile
# GOOD: Stable layers first (less likely to change)
COPY pnpm-lock.yaml .        # Changes rarely
RUN pnpm install             # Only rebuilds if lock changes

COPY . .                      # Changes often
RUN pnpm run build           # Rebuilds frequently

# BAD: Unstable layers first
COPY . .                      # Changes often → invalidates all layers below
RUN pnpm install && pnpm run build  # Rebuilds every time
```

### Benchmark

| Approach | Build Time | Image Size |
|----------|-----------|-----------|
| Single-stage (bad) | 8-10 min | 800MB |
| Multi-stage, no cache | 5-7 min | 200MB |
| Multi-stage + .dockerignore | 2-3 min | 180MB |
| **Target** | **1-2 min** | **~150MB** |

---

## 🔧 TIER 2: NODE.JS BUILD OPTIMIZATION

### Problem: Express/Node.js apps are bloated with devDependencies

**Solution: Multi-Stage + Production Dependencies Only**

```dockerfile
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:26-alpine
WORKDIR /app
RUN addgroup --gid 1001 nodejs && adduser --system --uid 1001 node
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s CMD node -e "require('http').get('http://localhost:3000/health')"
CMD ["node", "server.js"]
```

### .dockerignore (Node.js)

```
node_modules
npm-debug.log
.git
.env
.env.local
tests/
coverage/
dist/
build/
```

---

## 🔍 TIER 3: DEBUGGING COMMON ISSUES

### **Issue 1: Build Fails — COPY Cannot Find File**

```bash
# ❌ ERROR: COPY failed: file not found in build context
docker build .
```

**Diagnosis:**
```bash
# 1. Check what files actually exist
ls -la

# 2. Check Dockerfile paths
cat Dockerfile | grep COPY

# 3. Check .dockerignore (might be excluding files)
cat .dockerignore
```

**Solution:**
- Either create the missing file, OR
- Fix the COPY path in Dockerfile

Example fix:
```dockerfile
# ❌ WRONG: File doesn't exist
COPY apps/web-replycontrol/Dockerfile .

# ✅ RIGHT: Copy from actual location
COPY Dockerfile .

# OR: Copy everything you need
COPY package.json pnpm-lock.yaml ./
```

---

### **Issue 2: Container Starts Then Exits Immediately**

```bash
# Container shows "Exited (1)" in docker ps -a
docker ps -a
# CONTAINER ID  STATUS            NAMES
# abc123        Exited (1) 2m ago my-app
```

**Diagnosis:**
```bash
# Always check logs first
docker logs abc123

# See detailed error + stack trace
docker logs -f abc123

# Inspect container config
docker inspect abc123 | grep -A 5 "Cmd"
```

**Common Causes & Fixes:**

| Symptom in Logs | Cause | Fix |
|-----------------|-------|-----|
| `Cannot find module 'express'` | Dependencies not installed | `RUN npm install` in Dockerfile |
| `Error: listen EADDRINUSE` | Port already in use | Change port mapping in docker-compose.yml |
| `Error: connect ENOENT /run/docker.sock` | Trying to use Docker inside container | Remove Docker socket mount |
| `Cannot read property 'HOST' of undefined` | Missing env variable | Add to docker-compose.yml `environment:` |

---

### **Issue 3: Port Not Accessible**

```bash
# Application running but can't connect to localhost:3000
curl localhost:3000
# Connection refused
```

**Diagnosis:**
```bash
# 1. Check if container is actually running
docker ps | grep myapp

# 2. Check port mapping
docker ps
# Shows: 0.0.0.0:3000->3000/tcp

# 3. Check if port is listening inside container
docker exec myapp netstat -tlnp | grep 3000

# 4. Check container network
docker inspect myapp | grep IPAddress
```

**Fixes:**

- **Wrong port mapping:** Update docker-compose.yml
  ```yaml
  ports:
    - "3000:3000"  # host:container
  ```

- **App listening on wrong interface:**
  ```javascript
  // ❌ WRONG: Only listens on localhost (not accessible from outside)
  app.listen(3000, 'localhost')
  
  // ✅ RIGHT: Listen on all interfaces
  app.listen(3000, '0.0.0.0')
  ```

---

### **Issue 4: Image is Too Large (>500MB)**

```bash
# Check image size
docker images | grep myapp
# REPOSITORY  TAG     SIZE
# myapp       latest  856MB  ← TOO BIG!
```

**Diagnosis:**
```bash
# See what's in the image
docker image history myapp

# See layer sizes
docker image history myapp --human --no-trunc | head -20
```

**Common Causes:**

| Cause | Solution |
|-------|----------|
| Single-stage build | Use multi-stage: copy only `.next/` + `public/` + `node_modules` |
| devDependencies in production | Use `npm ci --omit=dev` |
| Large files cached | Add to `.dockerignore` |
| Base image bloat | Use alpine variant: `node:26-alpine` instead of `node:26` |

**Size Reduction Example:**
```dockerfile
# ❌ BLOATED: 800MB
FROM node:26
COPY . .
RUN npm install
CMD ["npm", "start"]

# ✅ LEAN: 150MB
FROM node:26-alpine AS builder
COPY . .
RUN npm ci --prod=false && npm run build

FROM node:26-alpine
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .
CMD ["node", "dist/server.js"]
```

---

## 📈 TIER 4: PERFORMANCE BENCHMARKING

### Measure Build Time

```bash
# Build with timing
time docker build -t myapp .

# Compare strategies
# Strategy A: Single-stage build
time docker build -f Dockerfile.single .

# Strategy B: Multi-stage + cache
time docker build -f Dockerfile.multi .
```

**Expected Results:**
- First build: 5-8 min (downloads base image, installs deps)
- Rebuild (deps unchanged): 30-60 sec (reuses node_modules layer)
- Rebuild (code changed only): 1-2 min (reuses most layers)

### Measure Image Size

```bash
# See full breakdown
docker image history myapp --human --no-trunc

# Compare images
docker images | grep myapp

# Calculate savings
# Original: 800MB, Optimized: 150MB = 81% reduction
```

---

## 🛠️ TIER 5: DOCKER COMPOSE ADVANCED

### Problem: Multiple Services Won't Start Together

```bash
docker compose up
# ❌ web: Error connecting to postgres:5432
# postgres service might not be ready yet
```

**Solution: Health Checks + Depends On**

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 5s
      timeout: 2s
      retries: 5

  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy  # Wait for healthcheck to pass
```

### Hot Reload During Development

```yaml
services:
  web:
    build: .
    volumes:
      - ./src:/app/src  # Bind mount source
    develop:
      watch:
        - action: rebuild
          path: package.json  # Rebuild if deps change
        - action: sync
          path: ./src        # Hot reload if src changes
```

---

## 📚 REFERENCE: CLI COMMANDS

```bash
# BUILD
docker build -t myapp:latest .                 # Build image
docker build --no-cache -t myapp .            # Build without cache (fresh)
docker build -f Dockerfile.prod .             # Use different Dockerfile

# RUN
docker run -p 3000:3000 myapp                 # Run and map ports
docker run -e NODE_ENV=production myapp       # Pass environment variable
docker run -v $(pwd):/app myapp               # Mount current directory
docker run -d myapp                           # Run in background (detached)

# DEBUG
docker ps                                      # List running containers
docker ps -a                                   # List all containers (including stopped)
docker logs <container>                        # See output
docker logs -f <container>                     # Follow logs (tail -f style)
docker exec -it <container> sh                 # Open shell inside container
docker inspect <container>                     # See full config
docker stats <container>                       # See memory/CPU usage

# COMPOSE
docker compose up                              # Start services
docker compose up --pull always                # Always pull latest images
docker compose up -d                           # Run in background
docker compose down                            # Stop and remove containers
docker compose logs -f                         # Follow all service logs
docker compose exec web sh                     # Run command in specific service

# CLEANUP
docker image rm <image>                        # Delete image
docker container rm <container>                # Delete container
docker system prune                            # Delete unused images/containers
docker system df                               # See disk usage
```

---

## ✅ OPTIMIZATION CHECKLIST

Before shipping to production:

- [ ] Multi-stage Dockerfile (builder + runtime)
- [ ] .dockerignore excludes node_modules, .git, tests, coverage
- [ ] Image size < 200MB for Node.js, < 300MB for Next.js
- [ ] Health checks configured
- [ ] Non-root user (USER nextjs / USER node)
- [ ] Environment variables documented in .env.example
- [ ] Secrets NOT baked into image (use docker-compose env_file or -e)
- [ ] EXPOSE port declared
- [ ] ENTRYPOINT or CMD specified
- [ ] Tested on your local machine: `docker build && docker run`
- [ ] Tested in docker-compose: `docker compose up --pull always`

---

## 📞 TROUBLESHOOTING FLOWCHART

```
Build fails?
├─ Yes, COPY error → Check file exists: ls -la
├─ Yes, npm not found → Ensure npm install in Dockerfile
├─ Yes, port conflict → Change port in docker-compose.yml

Container exits?
├─ Check logs: docker logs <container>
├─ No error in logs? → Might be intended (app finished)
├─ Error about port? → Port already in use
├─ Error about env var? → Add to docker-compose.yml environment:

Port not accessible?
├─ docker ps → Check port mapping is there
├─ docker inspect → Check IP address & network
├─ Try localhost vs 127.0.0.1 vs container IP

Image too large?
├─ docker image history → Identify fat layers
├─ Using multi-stage? → If no, implement it
├─ Excluding node_modules? → Add to .dockerignore
├─ Using alpine base? → If not, switch from ubuntu/debian

Performance slow?
├─ First build (normal): downloads base + installs = 5-10 min
├─ Rebuilds slow → .dockerignore not working or wrong layer order
├─ Add cache: Check if layer dependencies changed
```

---

## 📖 NEXT STEPS

1. **Read** this guide one section at a time
2. **Test** with your smallest project first (eu-ai-hub)
3. **Apply** multi-stage pattern to all Dockerfiles
4. **Benchmark** build times before/after
5. **Document** any custom patterns in your project's README.md

---

*Docker Optimization Guide — Keep this handy!*  
*Last Updated: 2026-09-16*
