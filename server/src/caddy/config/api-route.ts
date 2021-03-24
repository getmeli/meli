import { env } from '../../env/env';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { URL } from 'url';
import Route = Caddy.Http.Route;

const melihost = new URL(env.MELI_URL);

export const apiRoute: Route = {
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
