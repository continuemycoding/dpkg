FROM node:22-alpine AS frontend

WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM caddy:alpine AS caddybin

FROM debian:bookworm-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends dpkg-dev apt-utils xz-utils zstd ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=caddybin /usr/bin/caddy /usr/bin/caddy

COPY scripts/build-repo.sh scripts/entrypoint.sh /usr/local/bin/
RUN sed -i 's/\r$//' /usr/local/bin/build-repo.sh /usr/local/bin/entrypoint.sh \
	&& chmod +x /usr/local/bin/build-repo.sh /usr/local/bin/entrypoint.sh

COPY Caddyfile /etc/caddy/Caddyfile
COPY sources /sources

WORKDIR /usr/share/caddy

COPY --from=frontend /app/dist ./
COPY docs ./docs
COPY favicon.ico ./

RUN mkdir -p /data /config /usr/share/caddy/repos \
	&& build-repo.sh /sources/remotepro /usr/share/caddy/repos/remotepro

ENV XDG_CONFIG_HOME=/config
ENV XDG_DATA_HOME=/data

EXPOSE 80 443 443/udp

ENTRYPOINT ["entrypoint.sh"]
