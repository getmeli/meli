import { env } from '../../env';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { URL } from 'url';

const meliuihost = new URL(env.MELI_UI_HOST);

export const uiRoute = {
  group: 'ui',
  match: [{
    host: [meliuihost.host],
    path: ['/*'],
  }],
  handle: [
    // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
    env.MELI_UI_DIR ? {
      handler: 'file_server',
      root: env.MELI_UI_DIR,
    } : {
      handler: 'reverse_proxy',
      upstreams: [{
        dial: getReverseProxyDial(env.MELI_UI_HOST_INTERNAL.toString()),
      }],
    },
  ],
  terminal: true,
};
