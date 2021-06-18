import { getServiceMainDomain } from './get-service-main-domain';
import { Service, ServiceBranch } from './service';

export function getServiceBranchDomain(service: Service, branch: ServiceBranch) {
  return `${branch.slug}.${getServiceMainDomain(service, true)}`;
}
