import { env } from '../../env/env';
import { getServiceBranchDomain } from './get-service-branch-domain';
import { Service, ServiceBranch } from './service';
import { URL } from 'url';

const sitesUrl = new URL(env.MELI_SITES_URL);

export function getServiceBranchUrl(service: Service, branch: ServiceBranch) {
  return `${sitesUrl.protocol}//${getServiceBranchDomain(service, branch)}`;
}
