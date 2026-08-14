FROM node:22-alpine AS frontend

WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM caddy:alpine

COPY Caddyfile /etc/caddy/Caddyfile

WORKDIR /usr/share/caddy

COPY --from=frontend /app/dist ./
COPY docs ./docs

COPY favicon.ico Release* Packages* CydiaIcon* ./
# COPY debs ./debs

EXPOSE 80 443 443/udp
