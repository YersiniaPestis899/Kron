# ── Stage 1: Build ────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build the SvelteKit frontend
COPY . .
RUN npm run build

# Prune dev dependencies before copying to runner
RUN npm prune --production --legacy-peer-deps

# ── Stage 2: Runner ───────────────────────────────────────
FROM node:22-slim AS runner

WORKDIR /app

# Copy only what's needed at runtime
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build        ./build
COPY --from=builder /app/server       ./server
COPY --from=builder /app/scripts      ./scripts
COPY --from=builder /app/package.json ./

# /data is where Fly.io mounts the persistent volume for SQLite
RUN mkdir -p /data

ENV NODE_ENV=production
ENV PORT=8080
ENV DB_PATH=/data/kron.db

EXPOSE 8080

# SvelteKit adapter-node builds to build/index.js.
# It serves the frontend AND handles all /api/* routes via src/routes/api/.
CMD ["node", "build/index.js"]
