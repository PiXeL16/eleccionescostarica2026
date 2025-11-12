# ABOUTME: Multi-stage Dockerfile for Elecciones2026 static Next.js site
# ABOUTME: Optimized for static export with nginx serving

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

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the static export using Node.js
WORKDIR /app/web
# Rebuild better-sqlite3 for Node.js (was compiled for Bun)
RUN npm rebuild better-sqlite3

# Build the static export
RUN npm run build

# Verify the build output
RUN ls -la /app/web/out || (echo "Error: Build output not found" && exit 1)

# Production stage - serve static files with nginx
FROM nginx:alpine AS runner

# Copy nginx configuration
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from builder
COPY --from=builder /app/web/out /usr/share/nginx/html

# Create non-root user for nginx
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nextjs:nodejs /var/run/nginx.pid

USER nextjs

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
