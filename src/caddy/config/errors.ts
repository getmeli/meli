import { env } from '../../env';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';

export const errors = {
  routes: [
    // https://caddy.community/t/v2-need-help-with-the-json-configuration-for-custom-404-and-redirects/7059/13
    {
      handle: [{
        handler: 'vars',
        status_code: '{http.error.status_code}',
      }],
    },
    {
      match: [
        {
          vars: {
            status_code: '404',
          },
        },
      ],
      handle: [
        {
          handler: 'rewrite',
          uri: '/static/404.html',
        },
        // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
        {
          handler: 'reverse_proxy',
          upstreams: [{
            dial: getReverseProxyDial(env.MELI_CADDY_MELI_API_HOST?.host || env.MELI_HOST.host),
          }],
          handle_response: [{
            status_code: '{http.error.status_code}',
          }],
        },
      ],
      terminal: true,
    },
  ],
};
