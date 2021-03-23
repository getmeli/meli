ARG UI_VERSION=latest

# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
FROM getmeli/ui:${UI_VERSION} AS ui

FROM caddy:2

LABEL maintainer="meli.sh"

RUN apk add --no-cache \
       bash \
       nodejs \
  && mkdir -p /app/api/migrations

# caddy
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY docker/caddy-config.json /etc/caddy/config.json
# ui
COPY --from=ui /www /app/ui
# api
COPY ./build /app/api
COPY ./node_modules /app/api/node_modules
COPY ./migrate-mongo-config.js /app/api

WORKDIR /app/api

ENV MELI_URL_INTERNAL=http://localhost:3001
ENV MELI_UI_DIR=/app/ui

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "index.js"]
