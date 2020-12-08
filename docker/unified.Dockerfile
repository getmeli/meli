ARG UI_VERSION=latest

# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
FROM getmeli/ui:${UI_VERSION} AS ui

FROM caddy:2

# caddy
COPY ./docker/files/entrypoint.sh /entrypoint.sh
COPY ./docker/files/caddy-config.json /etc/caddy/config.json
# ui
COPY --from=ui /www /app/ui
# api
COPY ./build /app/api
COPY ./node_modules /app/api/node_modules
COPY ./migrate-mongo-config.js /app/api

RUN chmod +x /entrypoint.sh \
  && apk add --no-cache \
       bash \
       nodejs \
  && mkdir -p /app/api/migrations

WORKDIR /app

LABEL maintainer="meli.sh"

ENV MELI_URL_INTERNAL=http://localhost:3001
ENV MELI_UI_DIR=/app/ui

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "api/index.js"]
