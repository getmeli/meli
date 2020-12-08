#!/usr/bin/env sh
set -e

caddy start --config /etc/caddy/config.json

exec "$@"
