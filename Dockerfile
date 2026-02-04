FROM caddy:alpine

COPY Caddyfile /etc/caddy/Caddyfile

WORKDIR /usr/share/caddy

COPY index.html ./

COPY Release Packages* CydiaIcon* ./
# COPY debs ./debs

EXPOSE 80 443 443/udp
