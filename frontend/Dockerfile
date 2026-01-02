FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

EXPOSE 80

CMD ["npx", "next", "start", "-p", "80", "-H", "0.0.0.0"]
