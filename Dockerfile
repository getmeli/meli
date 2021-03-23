FROM caddy:2

LABEL maintainer="meli.sh"

RUN apk add --no-cache \
       bash \
       nodejs

# entrypoint
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# caddy
COPY ./docker/caddy-config.json /etc/caddy/config.json
# ui
COPY ./ui/build /app/ui
# server
COPY ./server/build /app/server
COPY ./server/node_modules /app/server/node_modules
COPY ./server/migrate-mongo-config.js /app/server
COPY ./server/migrations /app/server/migrations

WORKDIR /app/server

ENV MELI_URL_INTERNAL=http://localhost:3001
ENV MELI_UI_DIR=/app/ui

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "index.js"]
