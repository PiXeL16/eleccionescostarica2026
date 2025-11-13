# ABOUTME: Multi-stage Dockerfile for Elecciones2026 static Next.js site
# ABOUTME: Optimized for static export served with Bun

# Base image with Bun for building
FROM oven/bun:1.2-alpine AS base
WORKDIR /app

# Dependencies stage - install all dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app/web

# Copy package files
COPY web/package.json web/bun.lock ./

# Install dependencies
RUN bun install

# Builder stage - builds the static export using Node.js
FROM node:22-slim AS builder
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy database (needed for static generation)
COPY data/database.db ./data/database.db

# Copy application source (node_modules excluded by .dockerignore)
COPY web ./web

# Install dependencies fresh with npm (not from Bun)
WORKDIR /app/web
RUN npm install --legacy-peer-deps && \
    npm rebuild better-sqlite3 && \
    npm install --no-save --legacy-peer-deps $([ "$(uname -m)" = "x86_64" ] && echo "sqlite-vec-linux-x64" || echo "sqlite-vec-linux-arm64")

# Accept build arguments for Next.js public env vars
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG OPENAI_API_KEY

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Build Next.js application
WORKDIR /app/web
RUN npm run build

# Production stage - serve Next.js with Node.js
FROM node:22-slim AS runner
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy built application and dependencies from builder
COPY --from=builder /app/web/.next ./.next
COPY --from=builder /app/web/public ./public
COPY --from=builder /app/web/node_modules ./node_modules
COPY --from=builder /app/data ../data

# Copy Next.js config and package files
COPY web/next.config.mjs web/package.json web/bun.lock ./

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start Next.js with Node.js
CMD ["npm", "run", "start", "--", "-p", "8080"]
