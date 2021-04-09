FROM alpine:3.13

RUN apk add --no-cache \
  ca-certificates \
  caddy \
  nss \
  nss-tools

# set up nsswitch.conf for Go's "netgo" implementation
# - https://github.com/docker-library/golang/blob/1eb096131592bcbc90aa3b97471811c798a93573/1.14/alpine3.12/Dockerfile#L9
RUN mkdir -p ~/.pki/nssdb \
  && certutil -N --empty-password -d ~/.pki/nssdb \
  && [ ! -e /etc/nsswitch.conf ] && echo 'hosts: files dns' > /etc/nsswitch.conf

ENV XDG_CONFIG_HOME /caddy/config
ENV XDG_DATA_HOME /caddy/data
VOLUME /caddy/config
VOLUME /caddy/data

EXPOSE 80
EXPOSE 443
EXPOSE 2019

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
