FROM alpine:3.13

LABEL maintainer="meli.sh"

RUN apk add --no-cache \
       caddy \
       nodejs \
       npm

# entrypoint
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# caddy
COPY ./docker/caddy-config.json /etc/caddy/config.json
# ui
COPY ./ui/build /app/ui
# server
COPY ./server/build /app/server
COPY ./server/package.json /app/server
COPY ./server/package-lock.json /app/server
COPY ./server/migrate-mongo-config.js /app/server
COPY ./server/migrations /app/server/migrations

WORKDIR /app/server

RUN npm ci --production

ENV MELI_URL_INTERNAL=http://localhost:3001
ENV MELI_UI_DIR=/app/ui
ENV MELI_POSTHOG_ENABLED="true"

# Caddy defaults, copied from official Dockerfile
# https://github.com/caddyserver/caddy-docker/blob/2093c4a571bfe356447008d229195eb7063232b2/2.3/alpine/Dockerfile
ENV XDG_CONFIG_HOME /caddy/config
ENV XDG_DATA_HOME /caddy/data
VOLUME /caddy/config
VOLUME /caddy/data

EXPOSE 80
EXPOSE 443
EXPOSE 2019

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "index.js"]
