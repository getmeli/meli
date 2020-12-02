import { Branch } from './branch';
import { env } from '../../env';
import { Site } from './site';

export function getBranchUrl(site: Site, branch: Branch) {
  return `${env.MELI_SITES_DOMAIN.protocol}//${branch.name}.${site.name}.${env.MELI_SITES_DOMAIN.host}`;
}
