import { CADDY_CONFIG_FALLBACK_ROUTE_ID } from './ids';

export const fallback: Caddy.Http.Route = {
  /*
   * By default, caddy returns 200 with an empty response when no route matches.
   * This is a bit confusing, so we're changing it to a 523, used by Cloudflare to
   * indicate that the destination is unreachable.
   */
  '@id': CADDY_CONFIG_FALLBACK_ROUTE_ID,
  handle: [
    {
      handler: 'static_response',
      status_code: '523',
      body: 'Requested URL not served on this server',
    },
  ],
  terminal: true,
};
