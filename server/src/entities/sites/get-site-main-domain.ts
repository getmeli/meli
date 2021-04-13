import { URL } from 'url';
import { env } from '../../env/env';
import { Site } from './site';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getSiteMainDomain(site: Site, withPort = false): string {
  return `${
    site.name
  }.${
    sitesUrl.hostname
  }${
    withPort && sitesUrl.port !== '80' && sitesUrl.port !== '443' ? `:${sitesUrl.port}` : ''
  }`;
}
