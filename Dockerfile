FROM caddy:alpine

COPY Caddyfile /etc/caddy/Caddyfile

WORKDIR /usr/share/caddy

# COPY debs ./debs

COPY Release Packages* ./

EXPOSE 80 443 443/udp
