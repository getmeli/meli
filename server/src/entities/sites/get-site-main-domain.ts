import { URL } from 'url';
import { env } from '../../env/env';
import { Site } from './site';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getSiteMainDomain(site: Site): string {
  return `${site.name}.${sitesUrl.hostname}`;
}
