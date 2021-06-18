import { getServiceUrl } from './get-service-url';
import { serializeServiceBranch } from './serialize-service-branch';
import { Service } from './service';
import { getLogoUrl } from '../../utils/get-logo-url';

export function serializeService(service: Service): any {
  return {
    _id: service._id,
    projectId: service.projectId,
    color: service.color,
    logo: getLogoUrl('services', service),
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    name: service.name,
    mainBranch: service.mainBranch,
    domains: service.domains || [],
    branches: service.branches?.map(branch => serializeServiceBranch(service, branch)) || [],
    url: getServiceUrl(service),
  };
}
