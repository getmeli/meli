FROM node:12-alpine

COPY ./build /app/
COPY ./migrations /app/migrations
COPY ./node_modules /app/node_modules
COPY ./migrate-mongo-config.js /app/

WORKDIR /app

LABEL maintainer="meli.sh"

ENV MELI_PORT=80

EXPOSE 80

CMD ["node", "index.js"]
