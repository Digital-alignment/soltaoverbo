# Stage 1: Build static React SPA with Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve static files with lightweight Nginx
FROM nginx:alpine
COPY nginx/soltaoverbo.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /var/www/soltaoverbo
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
