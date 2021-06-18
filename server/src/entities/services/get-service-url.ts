import { Service } from './service';
import { env } from '../../env/env';
import { URL } from 'url';
import { getServiceMainDomain } from './get-service-main-domain';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getServiceUrl(service: Service): string {
  return `${sitesUrl.protocol}//${getServiceMainDomain(service, true)}`;
}
