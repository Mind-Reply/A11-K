# Sofia Tech Register — Multi-stage Node.js build
# Optimized for cloud run and local development

FROM node:20-slim AS base

WORKDIR /app

# Copy package files for layer caching
COPY package*.json ./

# Install dependencies (dev in build stage, omit in runtime)
RUN npm ci

# Copy application source
COPY src ./src
COPY config ./config
COPY data ./data

# Production stage — copy only runtime dependencies
FROM node:20-slim

WORKDIR /app

# Environment defaults (override at runtime)
ENV NODE_ENV=production
ENV PORT=8080

# Create output directory for ledger
RUN mkdir -p /app/output

# Copy only production dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/src ./src
COPY --from=base /app/config ./config
COPY --from=base /app/data ./data

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/healthz', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the ledger server
CMD ["node", "src/server.js"]
