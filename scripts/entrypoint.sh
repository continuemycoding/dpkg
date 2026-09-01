#!/usr/bin/env bash
set -euo pipefail

mkdir -p /sources/wegoin/debs /usr/share/caddy/repos
build-repo.sh /sources/wegoin /usr/share/caddy/repos/wegoin

exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile "$@"
