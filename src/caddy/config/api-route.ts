import { env } from '../../env/env';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { URL } from 'url';

const melihost = new URL(env.MELI_URL);

export const apiRoute = {
  group: 'api',
  match: [{
    host: [melihost.hostname],
    path: [
      `${env.MELI_API_PATH}*`,
    ],
  }],
  handle: [
    {
      handler: 'rewrite',
      strip_path_prefix: env.MELI_API_PATH,
    },
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
