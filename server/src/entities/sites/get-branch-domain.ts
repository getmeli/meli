import { Branch } from './branch';
import { Site } from './site';
import { getSiteMainDomain } from './get-site-main-domain';

export function getBranchDomain(site: Site, branch: Branch) {
  return `${branch.slug}.${getSiteMainDomain(site, true)}`;
}
