import { Site } from './site';
import { env } from '../../env';
import { URL } from 'url';

const url = new URL(env.MELI_SITES_HOST);

export function getSiteUrl(site: Site) {
  return `${url.protocol}//${site.name}.${url}`;
}
