import { env } from '../../env';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { URL } from 'url';

const melihost = new URL(env.MELI_URL);

export const apiRoute = {
  group: 'api',
  match: [{
    host: [melihost.host],
    path: [
      '/api/*',
      '/auth/*',
      '/socket.io/*',
    ],
  }],
  handle: [
    // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
    {
      handler: 'reverse_proxy',
      upstreams: [{
        dial: getReverseProxyDial(env.MELI_URL_INTERNAL.toString()),
      }],
    },
  ],
  terminal: true,
};
