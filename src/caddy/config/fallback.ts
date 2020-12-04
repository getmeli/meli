import { env } from '../../env';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { URL } from 'url';

const sitesUrl = new URL(env.MELI_SITES_HOST);

export const fallback = {
  group: 'fallback',
  match: [{
    host: [
      sitesUrl.host,
      `*.${sitesUrl.host}`,
      // TODO workaround we find how to make a generic fallback
      `*.*.${sitesUrl.host}`,
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
        dial: getReverseProxyDial(env.MELI_HOST_INTERNAL.toString()),
      }],
      handle_response: [{
        status_code: '404',
      }],
    },
    // {
    //   handler: 'static_response',
    //   body: 'The road ends here',
    // },
  ],
  terminal: true,
};
