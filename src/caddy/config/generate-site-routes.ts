import { AcmeSslConfiguration, Site, SiteDomain } from '../../entities/sites/site';
import { env } from '../../env/env';
import { unique } from '../../utils/arrays-utils';
import { RedirectType, ReverseProxyRedirectConfig } from '../../entities/sites/redirect';
import { relative, resolve } from 'path';
import { getBranchFilesDir, getFileRedirectFileName } from '../../entities/sites/get-site-dir';
import { URL } from 'url';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { BranchPassword } from '../../entities/sites/branch';
import { base64Encode } from '../../commons/utils/base64';
import { getBranchDirInCaddy } from '../utils/get-branch-dir-in-caddy';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function generateSiteRoutes(site: Site): any[] {
  const group = `site_${site._id}`;
  const domains: SiteDomain[] = [
    ...(site.domains || []),
    {
      name: `${site.name}.${sitesUrl.hostname}`,
      sslConfiguration: {
        type: 'acme',
      } as AcmeSslConfiguration,
    },
  ].filter(unique);

  return !site.branches ? [] : site.branches.flatMap(branch => {
    const hosts = domains.map(domain => `${branch.slug}.${domain.name}`);
    if (branch._id === site.mainBranch) {
      hosts.push(...domains.map(({ name }) => name));
    }
    return [
      ...(!branch.password ? [] : [{
        group,
        match: [{
          host: hosts,
        }],
        handle: [
          getAuthHandle(branch.password),
        ],
      }]),
      ...(!branch.redirects ? [] : branch.redirects.map(redirect => ({
        group,
        match: [{
          host: hosts,
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
      }))),
      {
        group,
        match: [{
          host: hosts,
        }],
        handle: [{
          handler: 'file_server',
          root: getBranchDirInCaddy(site._id, branch),
        }],
        terminal: true,
      },
    ];
  });
}

function getAuthHandle(password: BranchPassword) {
  return {
    // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/authentication/
    handler: 'authentication',
    providers: {
      // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/authentication/providers/http_basic/
      http_basic: {
        hash: {
          algorithm: 'bcrypt',
        },
        accounts: [{
          username: 'root',
          password: base64Encode(password.hash),
          salt: base64Encode(password.salt),
        }],
      },
    },
  };
}
