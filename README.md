<p align="center">
  <a href="https://meli.sh">
    <img alt="meli-logo" src="https://raw.githubusercontent.com/gomeli/meli-brand/latest/logo/meli-logo-circle-black.svg" width="100"/>
  </a>
</p>
<h1 align="center">meli</h1>
<p align="center">Open source platform for deploying static sites and frontend applications.</p>

> Found a security issue ? Please [let us know !](https://github.com/gomeli/meli/security/advisories/new)

Docs: https://docs.meli.sh

## How it works

1. Sign-in and create your organization
1. Create a site in your dashboard, say `my-site`
1. Upload a release with the `meli` CLI
1. Setup `my-domain.com` to point to `my-site.meli.sh`

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

## API

> API docs coming soon

1. Get your API token via the UI
1. When making a request, send your token in the `token` query param or `X-Token` header

## Webhooks

Webhooks are delivered with a `X-Webhook-Signature` header computed as an HMAC using `sha256`.

To verify the integrity of a webhook:
1. compute the signature of the request **raw body** using an HMAC with `sha256` and the webhook secret
1. verify that the computed signature equals the `X-Webhook-Signature` header content

Reference NodeJS TypeScript implementation:
```ts
import { createHmac } from 'crypto';

async function verifyWebhookSignature(req: Request, secret: string): Promise<boolean> {
  const signature = req.header('X-Webhook-Signature');
  const { rawBody } = req as any;
  if (!signature || !rawBody || !Buffer.isBuffer(rawBody)) {
    return false;
  }
  const hmac = createHmac('sha256', secret)
    .update(rawBody)
    .digest()
    .toString('hex');
  return hmac === signature;
}
```

In ExpressJS, the raw body of a request can be obtained as follows:
```js
app.use(json({
    verify: (req: any, res, buf) => {
      // for performance, only do this when needed
      if (Buffer.isBuffer(buf) && req.header('X-Webhook-Signature')) {
        // store raw body for signature verification
        req.rawBody = buf;
      }
      return true;
    },
}));
```

## Development

### DNS config

You need to configure your machine to allow wildcard domains for development. We've got a few ways to do this.

#### Use dev.meli.sh

We've configured dev.meli.sh to point to 127.0.0.1, so you can develop with it. Update your `.env`.

```
MELI_SITES_HOST=dev.meli.sh
```

Your sites will be served at `*.dev.meli.sh`.

Pros: simple, no config required
Cons: you need to be connected to the internet

#### Using /etc/hosts

Unfortunately, /etc/hosts doesn't support wildcard domains, so you'll need to edit /etc/hosts for every site added to meli:

```
127.0.0.1 my-site.test
```

Pros: simple
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

Pros: you don't need to be connected to the internet
Cons: a bit complex, config required

## Ready to dev

1. Run `docker-compose -f ./docker-compose-dev.yml up -d`
1. Configure your `.env` (copy `.env.example` to start with)
1. Run `npm start`

If you develop with the UI, you'll need to clone the [UI repo](https://github.com/getmeli/meli-ui), then start it.

You can now browse at `http://localhost:80`:
- `http://localhost:80/` => UI
- `http://localhost:80/api`, `http://localhost:80/auth` and `http://localhost:80/socket.io` => API
- `http://loopback.sh` => your sites will be served here

### SSL

Use [`mkcert`](https://github.com/FiloSottile/mkcert) to generate a certificate and key:

```shell script
brew install mkcert nss
mkcert -install
mkcert localhost
```

then update your `.env` with:

```
MELI_SSL_KEY=localhost-key.pem
MELI_SSL_CERT=localhost.pem
```

For runners to register properly, you need to set `NODE_EXTRA_CA_CERTS` to the path of `mkcert`'s root CA (which should be in the directory printed in your console when running `mkcert -install` - you can always re-run this command). Make sure `NODE_EXTRA_CA_CERTS` is set prior to running `npm start`, otherwise it won't work.
