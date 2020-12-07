import { Site } from '../../entities/sites/site';
import { URL } from 'url';
import { env } from '../../env';
import { getBranchDirInCaddy } from '../utils/get-branch-dir-in-caddy';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getSiteErrorRoutes(site: Site) {
  return site.branches.map(branch => {
    const hosts = [
      `${branch.slug}.${site.name}.${sitesUrl.host}`,
      ...site.domains.map(domain => `${branch.slug}.${domain.name}`),
    ];
    if (site.mainBranch === branch._id) {
      hosts.push(`${site.name}.${sitesUrl.host}`);
      hosts.push(...site.domains.map(domain => domain.name));
    }
    const branchDir = getBranchDirInCaddy(site._id, branch);
    return getErrorRoute(hosts, branchDir);
  });
}

function getErrorRoute(hosts: string[], rootDir: string) {
  return {
    match: [{
      vars: {
        status_code: '404',
      },
      host: hosts,
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
    terminal: true,
  };
}
