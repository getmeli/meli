import { AcmeSslConfiguration, Site, SiteDomain } from '../../../entities/sites/site';
import { env } from '../../../env/env';
import { unique } from '../../../utils/arrays-utils';
import { URL } from 'url';
import { getBranchDirInCaddy } from '../../utils/get-branch-dir-in-caddy';
import { getAuthHandler } from './get-auth-handler';
import { getRedirectRoute } from './get-redirect-route';

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
            {
              handle: [{
                handler: 'file_server',
                root: getBranchDirInCaddy(site._id, branch),
              }],
            },
          ],
        }],
        terminal: true,
      },
    ];
  });
}
