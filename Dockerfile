# Elastic Beanstalk Single Instance Dockerfile
# Adapts the Frontend Dockerfile to run from the Repository Root Context

# ---------- Build stage ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json from frontend directory
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source code
COPY frontend/ .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Runtime stage ----------
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application from builder stage
COPY --from=builder /app ./

EXPOSE 80
CMD ["npx", "next", "start", "-p", "80", "-H", "0.0.0.0"]
