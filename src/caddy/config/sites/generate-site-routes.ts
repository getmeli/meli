import { AcmeSslConfiguration, Site, SiteDomain } from '../../../entities/sites/site';
import { env } from '../../../env/env';
import { unique } from '../../../utils/arrays-utils';
import { URL } from 'url';
import { getAuthHandler } from './get-auth-handler';
import { getRedirectRoute } from './get-redirect-route';
import { getBranchDirInCaddy } from '../../../entities/sites/get-site-dir';
import { Branch } from '../../../entities/sites/branch';
import { getSite404ErrorRoutes } from './get-site-404-error-routes';

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
      {
        group,
        match: [{
          host: hosts,
        }],
        handle: [{
          handler: 'subroute',
          /*
           * Per Caddy's docs (https://caddyserver.com/docs/modules/http.handlers.subroute),
           * we could handle errors here for this site, but when I try it, it breaks
           * password protection. I'm assuming there's a clash between 401 handling, the
           * auth route and the error handler defined in errors.
           */
          routes: [
            ...(!branch.password ? [] : [{
              handle: [
                getAuthHandler(branch.password),
              ],
            }]),
            ...(!branch.redirects ? [] : branch.redirects.map(redirect => (
              getRedirectRoute(site, branch, redirect)
            ))),
            getPrimaryRoute(site, branch),
          ],
          errors: {
            routes: [
              get401Handler(),
              ...getSite404ErrorRoutes(site),
            ],
          },
        }],
      },
    ];
  });
}

function get401Handler() {
  return {
    match: [{
      expression: '{http.error.status_code} == 401',
    }],
    handle: [{
      handler: 'static_response',
      body: 'not authenticated',
      status_code: '{http.error.status_code}',
    }],
  };
}

function getPrimaryRoute(site: Site, branch: Branch) {
  const branchDirInCaddy = getBranchDirInCaddy(site._id, branch);
  if (site.spa) {
    return {
      match: [{
        file: {
          root: branchDirInCaddy,
          try_files: [
            '{http.request.uri.path}',
            '/index.html',
          ],
        },
      }],
      handle: [
        {
          handler: 'rewrite',
          uri: '{http.matchers.file.relative}',
        },
        {
          handler: 'file_server',
          root: branchDirInCaddy,
        },
      ],
    };
  }
  return {
    handle: [{
      handler: 'file_server',
      root: branchDirInCaddy,
    }],
  };
}
