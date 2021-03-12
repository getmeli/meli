import { Site, SiteDomain } from '../site';

export function getDomainWithBranches(domain: SiteDomain, site: Site) {
  return [
    domain.name,
    ...(domain.exposeBranches ? site.branches.map(branch => `${branch.slug}.${domain.name}`) : []),
  ];
}
