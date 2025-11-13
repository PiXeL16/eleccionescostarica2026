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
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy dependencies from Bun install
COPY --from=deps /app/web/node_modules ./web/node_modules

# Copy package files for rebuilding native modules
COPY web/package.json web/bun.lock ./web/

# Copy database (needed for static generation)
COPY data/database.db ./data/database.db

# Copy application source
COPY web ./web

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

# Build the static export using Node.js
WORKDIR /app/web
# Rebuild native modules for Node.js (were compiled for Bun)
RUN npm rebuild better-sqlite3 && \
    npm install --force sqlite-vec

# Build the static export
RUN npm run build

# Verify the build output
RUN ls -la /app/web/out || (echo "Error: Build output not found" && exit 1)

# Production stage - serve static files with Bun
FROM base AS runner
WORKDIR /app

# Copy static files from builder
COPY --from=builder /app/web/out ./out

# Copy Bun server
COPY web/server.ts ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["bun", "run", "server.ts"]
