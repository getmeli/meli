import { env } from '../../env';

export const appServer = {
  listen: [':8080'],
  routes: [
    {
      group: 'api',
      match: [{
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
            dial: env.MELI_CADDY_API_HOST?.host || env.MELI_HOST.host,
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
            dial: env.MELI_CADDY_UI_HOST?.host || env.MELI_UI_HOST.host,
          }],
        },
      ],
      terminal: true,
    },
  ],
};
