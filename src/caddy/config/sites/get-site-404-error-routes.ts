import { Site } from '../../../entities/sites/site';
import { URL } from 'url';
import { env } from '../../../env/env';
import { getBranchDirInCaddy } from '../../../entities/sites/get-site-dir';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getSite404ErrorRoutes(site: Site) {
  return site.branches.map(branch => {
    const hosts = [
      `${branch.slug}.${site.name}.${sitesUrl.hostname}`,
      ...site.domains.map(domain => `${branch.slug}.${domain.name}`),
    ];
    if (site.mainBranch === branch._id) {
      hosts.push(`${site.name}.${sitesUrl.hostname}`);
      hosts.push(...site.domains.map(domain => domain.name));
    }
    const branchDir = getBranchDirInCaddy(site._id, branch._id);
    return getErrorRoute(hosts, branchDir);
  });
}

function getErrorRoute(hosts: string[], rootDir: string) {
  return {
    match: [{
      expression: '{http.error.status_code} == 404',
    }],
    handle: [
      {
        handler: 'rewrite',
        uri: '/404.html',
      },
      // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
      {
        handler: 'file_server',
        root: rootDir,
      },
    ],
  };
}
