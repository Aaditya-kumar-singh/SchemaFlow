
# -----------------------------------------------------------------------------
# BACKEND DOCKERFILE (NestJS/Next.js Custom Server)
# -----------------------------------------------------------------------------

# 1. Base Image
FROM node:20-alpine AS base

# Install OpenSSL (required for Prisma)
# Install OpenSSL (required for Prisma)
# Node 20 Alpine uses Alpine 3.18+, which provides OpenSSL 3.
# This matches our Prisma binaryTarget "linux-musl-openssl-3.0.x"
RUN apk add --no-cache openssl

# 2. Dependencies
FROM base AS deps
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

# Build Next.js app (for the API routes/pages handled by Next)
RUN npm run build

# Compile Custom Server (main.ts)
# We use a custom tsconfig to emit the server files to dist/
COPY tsconfig.server.json .
RUN npx tsc --project tsconfig.server.json

# 4. Runner
FROM base AS runner
WORKDIR /app

# OpenSSL is already installed in 'base', no need to install again.

ENV NODE_ENV production
ENV PORT 3002

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential files
COPY --from=builder /app/package.json ./package.json
# Using wildcards for optional config files is cleaner
# COPY --from=builder /app/public ./public
# Copy next.config.js or ts if they exist (using wildcard trick)
COPY --from=builder /app/next.config.* ./
# IMPORTANT: Next.js tries to write to tsconfig.json at runtime to verify defaults
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

# Copy .next directory and ensure it is writable by the nextjs user
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/dist ./dist
# Copy src folder so Next.js can resolve 'pages' or 'app' dir checks
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma schema for reference (optional but good for debugging)
COPY --from=builder /app/prisma ./prisma

# Ensure logs directory exists
RUN mkdir logs

# VALIDATION FIX: Recursively change ownership of the entire app directory
# This fixes all "EACCES" errors for tsconfig.json, next-env.d.ts, .next/cache, etc.
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3002

# We run the COMPILED custom server.
CMD ["node", "dist/main.js"]
