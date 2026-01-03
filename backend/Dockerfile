
# -----------------------------------------------------------------------------
# BACKEND DOCKERFILE (NestJS/Next.js Custom Server)
# -----------------------------------------------------------------------------

# 1. Base Image
FROM node:20-alpine AS base

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

ENV NODE_ENV production
ENV PORT 3002

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# Copy Prisma schema/migrations if needed for runtime (though client is baked in)
# COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3002

# We run the COMPILED custom server. Try both paths to be safe.
CMD ["sh", "-c", "if [ -f dist/main.js ]; then node dist/main.js; else node dist/src/main.js; fi"]
