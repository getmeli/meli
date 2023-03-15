<p align="center">
  <a href="https://meli.sh">
    <img alt="meli-logo" src="https://raw.githubusercontent.com/gomeli/meli-brand/latest/logo/meli-logo-circle-black.svg" width="100"/>
  </a>
</p>
<h1 align="center">meli</h1>
<p align="center">Open source platform for deploying static sites and frontend applications.</p>
<p align="center">
    <a href="https://docs.meli.charlie-bravo.be">Docs</a> (proudly hosted on Meli !) - <a href="https://twitter.com/getmeli">Twitter</a>
</p>
<p align="center">
    <a href="https://discord.gg/TFTaCUEdX6" target="_blank">
        <img alt="Discord" src="https://img.shields.io/discord/789462736320856075?label=community">
    </a>
</p>

> We are looking for maintainers ! Interested to take over ? Shoot us an email at info@charlie-bravo.be

![Meli demo screenshot](https://raw.githubusercontent.com/getmeli/meli-brand/latest/screens/meli-site-branch.png)

## Getting started

Want to change the way you ship front-end, forever ? Let's get started !

1. Head to our [installation instructions](https://docs.meli.charlie-bravo.be/get-started/installation)
1. After you have installed Meli and have successfully logged in:
    1. Create a site in your dashboard, say `my-site`
    1. [Upload a release with the `@getmeli/meli` CLI](https://docs.meli.charlie-bravo.be/get-started/upload-a-site-to-meli)
    1. Setup `my-domain.com` to point to your Meli server at `my-site.mymeli.com`

## Features

- Deploy unlimited static sites under a primary domain
- Unlimited organizations, teams, users and sites
- Seamless custom domains redirection
- [Many ways to authenticate](https://docs.meli.charlie-bravo.be/authentication)
- [Automatic HTTPs certificate issuing with letsencrypt (or private ACME server)](https://docs.meli.charlie-bravo.be/configuration/ssl)
- [Deploy branches](https://docs.meli.charlie-bravo.be/get-started/branches)
- [API with per-endpoint scopes](https://docs.meli.charlie-bravo.be/api/get-started)
- Integrations ([Webhooks](https://docs.meli.charlie-bravo.be/integrations/webhooks), [Slack](https://docs.meli.charlie-bravo.be/integrations/slack)
  , [Mattermost](https://docs.meli.charlie-bravo.be/integrations/mattermost), [Email](https://docs.meli.charlie-bravo.be/integrations/email))
- Easily [deploy](https://docs.meli.charlie-bravo.be/get-started/installation#installation)
  and [upgrade](https://docs.meli.charlie-bravo.be/get-started/upgrade-and-downgrade) with Docker Compose
- [Password protected pages](https://docs.meli.charlie-bravo.be/branches/password-protected-pages)
- [Path overrides with in-memory files or reverse proxies](https://docs.meli.charlie-bravo.be/branches/redirects#redirects)
- [Single page application mode](https://docs.meli.charlie-bravo.be/get-started/single-page-applications-spa)
- Get deploy URL in pull requests and commit status
- [Heavily customizable](https://docs.meli.charlie-bravo.be/environment-reference/server)
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

1. Run `docker-compose -f ./docker-compose-dev.yml up -d`
1. Configure `server/.env` (copy `server/.env.example` to start with)
1. Run `npm i && npm start`

You can now browse at `http://localhost:8080`:

- `http://localhost:8080/` => UI
- `http://localhost:8080/api`, `http://localhost:8080/auth`, `http://localhost:8080/system` and `http://localhost:8080/socket.io` => API
- `http://loopback.sh` => your sites will be served here

### DNS config

You need to configure your machine to allow wildcard domains for development. We've got a few ways to do this.

#### Use loopback.sh

We've configured loopback.sh to point to 127.0.0.1, so you can develop with it. Update your `.env`.

```
MELI_SITES_URL=loopback.sh
```

Your sites will be served at `*.loopback.sh`.

Pros: simple, no config required Cons: you need to be connected to the internet

#### Using /etc/hosts

Unfortunately, /etc/hosts doesn't support wildcard domains, so you'll need to edit /etc/hosts for every site added to Meli:

```
127.0.0.1 my-site.test
127.0.0.1 my-channel.my-site.test
```

Pros: simple, can develop without internet Cons: have to reconfigure every time you add a site

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

Pros: you don't need to be connected to the internet, no need to reconfigure /etc/hosts Cons: a bit complex, config required

## License

The words "Open Source" in our README refer to the definition given by many well-recognized dictionaries of various languages, which is "
used to describe software for which the original source code is made available to anyone".

The words "Open Source" in our license, introduced and written by MariaDB, refer to the definition given by the Open Source Foundation.
Though we adopted this license to make it easier for users to recognize it, we disagree with this sentence being part of it and are working
on this matter.

The BSL license allows you to modify, share, redistribute and use this software for free with the only condition that you do not run a
competing SAAS service based on this project, which would both be unfair and jeopardize the options of making this tool sustainable.

We chose the BSL license because we believe it is fair for both users and maintainers. It allows us to secure a monetization path while
providing proper support in the long run. Also, our license converts automatically within 4 years of each release to a license officially
recognized by the Open Source Foundation, which secures a way for the community to see the sole restriction removed.

We are aware of the debate around the BSL conflicting with rule number 9 of the definition given by the Open Source Foundation. We do
believe that, in specific cases, this rule should be relaxed as it prevents platform maintainers to secure a path to sustaining the
development of their tool and support of their community while preventing large players from running unfair competition by leveraging their
infrastructure and name. There is sufficient material on this matter available on the internet for users to make up their mind.

As a side note, rule number 9 conflicts similarly with the BSL than with the GPL3.0, which does restrict the creation of other software in
its own way, while still being officially recognized by the Open Source Foundation.
