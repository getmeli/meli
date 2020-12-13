import { Site } from '../../../entities/sites/site';
import { Branch } from '../../../entities/sites/branch';
import { Redirect, RedirectType, ReverseProxyRedirectConfig } from '../../../entities/sites/redirect';
import { getBranchFilesDir, getFileRedirectFileName } from '../../../entities/sites/get-site-dir';
import { relative, resolve } from 'path';
import { env } from '../../../env/env';
import { URL } from 'url';
import { getReverseProxyDial } from '../../utils/get-reverse-proxy-dial';

export function getRedirectRoute(site: Site, branch: Branch, redirect: Redirect) {
  return {
    match: [{
      // https://caddyserver.com/docs/json/apps/http/servers/routes/match/path/
      path: [redirect.path],
    }],
    handle: redirect.type === RedirectType.file ? [
      {
        // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/rewrite/
        handler: 'rewrite',
        uri: getFileRedirectFileName(redirect),
      },
      {
        handler: 'file_server',
        root: resolve(env.MELI_CADDY_DIR, relative(env.MELI_SITES_DIR, getBranchFilesDir(site._id, branch))),
      },
    ] : [
      ...(!(redirect.config as ReverseProxyRedirectConfig).stripPathPrefix ? [] : [{
        // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/rewrite/
        handler: 'rewrite',
        strip_path_prefix: (redirect.config as ReverseProxyRedirectConfig).stripPathPrefix,
      }]),
      {
        // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
        handler: 'reverse_proxy',
        transport: {
          protocol: 'http',
          tls: new URL((redirect.config as ReverseProxyRedirectConfig).url).protocol === 'https:' ? {} : undefined,
        },
        upstreams: [{
          dial: getReverseProxyDial((redirect.config as ReverseProxyRedirectConfig).url),
        }],
        headers: {
          request: {
            add: {
              host: [new URL((redirect.config as ReverseProxyRedirectConfig).url).host],
              'X-Proxied-By': ['Meli/Caddy'],
            },
          },
        },
      },
    ],
    terminal: true,
  };
}
