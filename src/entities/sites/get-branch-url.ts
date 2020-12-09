import { Branch } from './branch';
import { env } from '../../env/env';
import { Site } from './site';
import { URL } from 'url';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getBranchUrl(site: Site, branch: Branch) {
  return `${sitesUrl.protocol}//${branch.name}.${site.name}.${sitesUrl.host}`;
}
