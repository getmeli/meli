import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { env } from '../../env/env';

export const fallback = {
  /*
   * By default, caddy returns 200 with an empty response when no route matches.
   * This is a bit confusing, so we're changing it to a 523, used by Cloudflare to
   * indicate that the destination is unreachable.
   */
  handle: [
    {
      handler: 'rewrite',
      uri: '/static/523.html',
    },
    // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
    {
      handler: 'reverse_proxy',
      upstreams: [{
        dial: getReverseProxyDial(env.MELI_URL_INTERNAL),
      }],
      handle_response: [{
        status_code: '523',
      }],
    },
  ],
  terminal: true,
};
