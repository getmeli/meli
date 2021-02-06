import { env } from '../../env/env';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { URL } from 'url';

const melihost = new URL(env.MELI_URL);

export const apiRoute: Caddy.HttpRoute = {
  group: 'api',
  match: [{
    host: [melihost.hostname],
    path: [
      '/api/*',
      '/auth/*',
      '/system/*',
      '/socket.io/*',
    ],
  }],
  handle: [
    // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
    {
      handler: 'reverse_proxy',
      upstreams: [{
        dial: getReverseProxyDial(env.MELI_URL_INTERNAL),
      }],
    },
  ],
  terminal: true,
};
