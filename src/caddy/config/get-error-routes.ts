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
            handler: 'static_response',
            status_code: '404',
            body: 'Not found',
          },
        ],
        terminal: true,
      },
    ],
  };
}
