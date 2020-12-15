import { URL } from 'url';
import { env } from '../../env/env';
import { Branch } from './branch';
import { Site } from './site';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getBranchDomain(site: Site, branch: Branch) {
  return `${branch.name}.${site.name}.${sitesUrl.host}`;
}
