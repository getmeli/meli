<p align="center">
  <a href="https://meli.sh">
    <img alt="meli-logo" src="https://raw.githubusercontent.com/gomeli/meli-brand/latest/logo/meli-logo-circle-black.svg" width="100"/>
  </a>
</p>
<h1 align="center">meli</h1>
<p align="center">Open source platform for deploying static sites and frontend applications.</p>
<p align="center">
    <a href="https://docs.meli.sh">Docs</a> (proudly hosted on Meli !) - <a href="https://twitter.com/getmeli">Twitter</a>
</p>

![Meli demo screenshot](https://raw.githubusercontent.com/getmeli/meli-brand/latest/screens/meli-site-branch.png)

## How it works

1. Sign-in and create your organization
1. Create a site in your dashboard, say `my-site`
1. Upload a release with the `@getmeli/meli` CLI
1. Setup `my-domain.com` to point to your Meli server at `my-site.mymeli.com`

## Features

- Deploy unlimited static sites under a primary domain
- Unlimited organizations, teams, users and sites
- Seamless custom domains redirection
- Automatic HTTPs certificate issuing with letsencrypt (or private ACME server)
- Primary releases and branch (preview) releases
- API with fully configurable scopes
- Webhooks
- Integrations (Slack, Mattermost, Email)
- Easily deploy and upgrade with Docker Compose
- Password protected pages
- Get deploy URL in pull requests and commit status
- [ ] Increase test coverage
- [ ] API documentation
- [ ] Documentation
- [ ] Build an official project website
- [ ] Create a community discussion branch
- [ ] Deploy a cloud version
- [ ] Translations
- [ ] Extend integrations
- [ ] Accessibility

## Development

### Start UI

1. Clone the [UI repo](https://github.com/getmeli/meli-ui).
1. `npm i && npm start`
1. The app is accessible from http://localhost:3001, but we develop from http://localhost:80 (see below)

### Start Caddy and the API

1. Run `docker-compose -f ./docker-compose-dev.yml up -d`
1. Configure your `.env` (copy `.env.example` to start with)
1. Run `npm start`

If you develop with the UI, you'll need to clone the [UI repo](https://github.com/getmeli/meli-ui), then start it.

You can now browse at `http://localhost:80`:
- `http://localhost:80/` => UI
- `http://localhost:80/api`, `http://localhost:80/auth` and `http://localhost:80/socket.io` => API
- `http://loopback.sh` => your sites will be served here

### DNS config

You need to configure your machine to allow wildcard domains for development. We've got a few ways to do this.

#### Use loopback.sh

We've configured loopback.sh to point to 127.0.0.1, so you can develop with it. Update your `.env`.

```
MELI_SITES_URL=loopback.sh
```

Your sites will be served at `*.loopback.sh`.

Pros: simple, no config required
Cons: you need to be connected to the internet

#### Using /etc/hosts

Unfortunately, /etc/hosts doesn't support wildcard domains, so you'll need to edit /etc/hosts for every site added to Meli:

```
127.0.0.1 my-site.test
127.0.0.1 my-channel.my-site.test
```

Pros: simple, can develop without internet
Cons: have to reconfigure every time you add a site

#### Using dnsmasq

```
brew install dnsmasq

# tell dsnmasq to point *.test to 127.0.0.1
echo "address=/test/127.0.0.1" > /usr/local/etc/dnsmasq.conf

# start daemon
brew services start dnsmasq

# make OSX point to dnsmasq
sudo mkdir -p /etc/resolver

# tell os x to point *.test to 127.0.0.1
sudo echo "nameserver 127.0.0.1" > /etc/resolver/test

ping hello.test
```

Your sites will be served at `*.test`.

Pros: you don't need to be connected to the internet, no need to reconfigure /etc/hosts
Cons: a bit complex, config required
