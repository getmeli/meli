#!/usr/bin/env sh
set -e

/env.sh "MELI_" "/app/ui"

caddy start --config /etc/caddy/config.json

echo "MELI_API_URL=$MELI_URL" > /app/ui/env.txt

exec "$@"
