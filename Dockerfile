# Stage 1: Build static React SPA with Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve static files with Nginx + internal Node.js microservice
FROM node:20-alpine
RUN apk add --no-cache nginx && mkdir -p /run/nginx /var/log/nginx /etc/nginx/http.d && rm -rf /etc/nginx/conf.d/*

COPY nginx/soltaoverbo.conf /etc/nginx/http.d/default.conf

COPY --from=builder /app/dist /var/www/soltaoverbo
COPY server /app/server
COPY package*.json /app/
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

WORKDIR /app
EXPOSE 80

CMD ["/docker-entrypoint.sh"]
