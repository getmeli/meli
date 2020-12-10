#!/usr/bin/env sh
set -e

/env.sh "MELI_" "/www"

caddy start --config /etc/caddy/config.json

exec "$@"
