# MindReply Gemini proxy + Sofia Tech Ledger server — Cloud Run image.
# Runs src/server.js which serves /healthz, /run, and /gemini (fail-closed).

FROM node:20-slim

WORKDIR /app

# Copy package files first for layer caching.
COPY package.json package-lock.json* ./

# No runtime npm dependencies are required (uses native fetch + node:http),
# but install if a lockfile exists to keep the image reproducible.
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; fi

# Copy application source.
COPY src ./src

# Cloud Run expects the container to listen on $PORT (default 8080).
ENV PORT=8080
ENV NODE_ENV=production

# Fail-closed defaults: no credential means the /gemini endpoint returns 503.
# Set these at deploy time via Cloud Run env vars / secrets:
#   GOOGLE_API_KEY            (API-key path)  OR
#   GOOGLE_CLOUD_PROJECT      (Vertex AI path)
#   GOOGLE_CLOUD_LOCATION     (Vertex AI path, e.g. global or europe-west1)
#   GOOGLE_GENAI_USE_ENTERPRISE=True

EXPOSE 8080

# Start the HTTP server (ledger + Gemini proxy).
CMD ["node", "src/server.js"]