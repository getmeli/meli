import { env } from '../../env';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { Site } from '../../entities/sites/site';
import { getSiteErrorRoutes } from './get-site-error-routes';

export function getErrorRoutes(sites: Site[]) {
  return {
    routes: [
      // https://caddy.community/t/v2-need-help-with-the-json-configuration-for-custom-404-and-redirects/7059/13
      {
        handle: [{
          handler: 'vars',
          status_code: '{http.error.status_code}',
        }],
      },
      ...sites.flatMap(getSiteErrorRoutes),
      // fallback
      {
        match: [{
          vars: {
            status_code: '404',
          },
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
              dial: getReverseProxyDial(env.MELI_URL_INTERNAL),
            }],
            handle_response: [{
              // express replies with 200 OK, so override with initial caddy status code
              status_code: '{http.error.status_code}',
            }],
          },
        ],
        terminal: true,
      },
    ],
  };
}
