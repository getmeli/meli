import { URL } from 'url';
import { env } from '../../env/env';
import { Service } from './service';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getServiceMainDomain(service: Service, withPort = false): string {
  return `${
    service.name
  }.${
    sitesUrl.hostname
  }${
    withPort && sitesUrl.port !== '80' && sitesUrl.port !== '443' ? `:${sitesUrl.port}` : ''
  }`;
}
