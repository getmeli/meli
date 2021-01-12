import { Site } from './site';
import { env } from '../../env/env';
import { URL } from 'url';
import { getSiteMainDomain } from './get-site-main-domain';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getSiteUrl(site: Site): string {
  return `${sitesUrl.protocol}//${getSiteMainDomain(site)}`;
}
