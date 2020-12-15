import { URL } from 'url';
import { env } from '../../env/env';
import { Site } from './site';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getSiteDomain(site: Site) {
  return `${site.name}.${sitesUrl.host}`;
}
