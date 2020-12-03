import { env } from '../../env';

export const fallback = {
  group: 'fallback',
  match: [{
    host: [
      env.MELI_SITES_DOMAIN.host,
      `*.${env.MELI_SITES_DOMAIN.host}`,
    ],
  }],
  handle: [
    {
      handler: 'rewrite',
      uri: '/static/404.html',
    },
    // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
    {
      handler: 'reverse_proxy',
      upstreams: [{
        dial: env.MELI_CADDY_MELI_API_HOST?.host || env.MELI_HOST,
      }],
      handle_response: [{
        status_code: '404',
      }],
    },
  ],
  terminal: true,
};
