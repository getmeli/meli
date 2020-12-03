import { env } from '../../env';

const apiHost = env.MELI_CADDY_MELI_API_HOST?.host || env.MELI_HOST.host;
const uiHost = env.MELI_CADDY_MELI_UI_HOST?.host || env.MELI_UI_HOST.host;

export const appServer = {
  listen: [':8080'],
  routes: [
    {
      group: 'api',
      match: [{
        host: [
          apiHost,
          uiHost,
        ],
        path: [
          '/api/*',
          '/auth/*',
        ],
      }],
      handle: [
        // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
        {
          handler: 'reverse_proxy',
          upstreams: [{
            dial: apiHost,
          }],
        },
      ],
      terminal: true,
    },
    {
      group: 'ui',
      match: [{
        path: ['/*'],
      }],
      handle: [
        // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
        {
          handler: 'reverse_proxy',
          upstreams: [{
            dial: uiHost,
          }],
        },
      ],
      terminal: true,
    },
  ],
};
