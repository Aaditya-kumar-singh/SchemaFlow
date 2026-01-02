# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
# Ensure output: 'export' IS NOT USED for Elastic Beanstalk generally if we want SSR, 
# but if we want static we can uses S3.
# AWS EB usually runs a Node server.
# Next.js standalone output is best for docker.

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

EXPOSE 80

CMD ["npm", "start", "--", "-p", "80", "--hostname", "0.0.0.0"]
