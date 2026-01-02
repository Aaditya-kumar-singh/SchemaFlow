# Backend Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies (incorporating lockfile if available)
COPY package*.json ./
# Use ci for deterministic installs if lockfile exists, else install
RUN npm ci --only=production || npm install --only=production

# Copy source code
COPY . .

# Generate Prisma client if schema exists
RUN if [ -f "prisma/schema.prisma" ]; then npx prisma generate; fi

# Expose port (default Next.js port)
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
