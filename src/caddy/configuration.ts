import axios from 'axios';
import { relative, resolve } from 'path';
import { Logger } from '../commons/logger/logger';
import { env } from '../env';
import {
  AcmeSslConfiguration, Site, SiteDomain, Sites,
} from '../entities/sites/site';
import { unique } from '../utils/arrays-utils';
import { errors } from './config/errors';
import { fallback } from './config/fallback';
import { base64Encode } from '../commons/utils/base64';
import { Branch, BranchPassword } from '../entities/sites/branch';
import { getBranchFilesDir, getBranchStaticDir } from '../entities/sites/get-site-dir';
import { RedirectType, ReverseProxyRedirectConfig } from '../entities/sites/redirect';
import { getReverseProxyDial } from './utils/get-reverse-proxy-dial';
import { URL } from 'url';

const logger = new Logger('meli.server:caddy');

export async function configureCaddy(): Promise<void> {
  logger.debug('Configuring Caddy...');
  const config = await generateConfig();
  logger.debug(JSON.stringify(config, null, 2));
  await axios.post(`${env.MELI_CADDY_ADMIN_API_URL}/load`, config);
}

export async function configureSiteInCaddy(site: Site) {
  logger.debug(`Reconfigured site ${site._id} in Caddy`);
  // TODO reconfigure site only
  await configureCaddy();
}

export async function removeSiteFromCaddy(siteId: string) {
  logger.debug(`Removing site ${siteId} from Caddy`);
  // TODO reconfigure site only
  await configureCaddy();
}

export async function configureSiteBranchInCaddy(site: Site, branch: Branch): Promise<void> {
  logger.debug(`Reconfigured site branch ${site._id}:${branch.name} in Caddy`);
  // TODO reconfigure branch only (or use another system so we don't have to reconfigure anything on publish)
  await configureCaddy();
}

export async function removeSiteBranchFromCaddy(siteId: string, channelName: string): Promise<void> {
  logger.debug(`Reconfigured site branch ${siteId}:${channelName} from Caddy`);
  // TODO reconfigure branch only (or use another system so we don't have to reconfigure anything on publish)
  await configureCaddy();
}

async function generateConfig(): Promise<any> {
  const sites = await Sites().find().toArray();

  return {
    logging: {
      logs: {
        default: {
          level: 'DEBUG',
        },
      },
    },
    admin: {
      disabled: false,
      listen: env.MELI_CADDY_DOCKER ? '0.0.0.0:2019' : '127.0.0.1:2019',
    },
    apps: {
      http: {
        servers: {
          sites: {
            listen: [':80'],
            routes: [
              ...sites.flatMap(generateSiteRoutes),
              fallback,
            ],
            errors,
          },
        },
      },
    },
  };
}

function generateSiteRoutes(site: Site): any[] {
  const group = `site_${site._id}`;
  const domains: SiteDomain[] = [
    ...(site.domains || []),
    {
      name: `${site.name}.${env.MELI_SITES_DOMAIN.host}`,
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
          // {
          //   // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/rewrite/
          //   handler: 'rewrite',
          //   uri: getFileRedirectFileName(redirect),
          // },
          {
            handler: 'file_server',
            root: resolve(env.MELI_CADDY_DIR, relative(env.MELI_SITES_DIR, getBranchFilesDir(site._id, branch))),
          },
        ] : [
          {
            // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/rewrite/
            handler: 'rewrite',
            strip_path_prefix: (redirect.config as ReverseProxyRedirectConfig).stripPathPrefix,
          },
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
          root: resolve(env.MELI_CADDY_DIR, relative(env.MELI_SITES_DIR, getBranchStaticDir(site._id, branch))),
        }],
        terminal: true,
      },
    ];
  });
}

function getAuthHandle(password: BranchPassword) {
  logger.debug('generating branch middleware', password);
  return {
    // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/authentication/
    handler: 'authentication',
    providers: {
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
