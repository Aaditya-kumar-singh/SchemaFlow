# Frontend Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source
COPY . .

# Build the application (Static Export)
# Ensure output: 'export' is set in next.config.ts
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static build from builder stage
# Next.js 'output: export' writes to 'out' folder by default
COPY --from=builder /app/out .

# Copy custom nginx config if needed (optional, using default for now)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
