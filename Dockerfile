FROM caddy:alpine

COPY Caddyfile /etc/caddy/Caddyfile

WORKDIR /usr/share/caddy

COPY index.html ./
COPY assets ./assets

COPY favicon.ico Release* Packages* CydiaIcon* ./
# COPY debs ./debs

EXPOSE 80 443 443/udp
