import { Site } from './site';
import { env } from '../../env';

export function getSiteUrl(site: Site) {
  return `${env.MELI_SITES_DOMAIN.protocol}//${site.name}.${env.MELI_SITES_DOMAIN.host}`;
}
