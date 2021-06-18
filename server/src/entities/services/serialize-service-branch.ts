import { getServiceBranchUrl } from './get-service-branch-url';
import { Service, ServiceBranch } from './service';

export function serializeServiceBranch(service: Service, branch: ServiceBranch) {
  return !branch ? undefined : {
    _id: branch._id,
    name: branch.name,
    release: branch.release,
    // hasPassword: !!branch.password,
    url: getServiceBranchUrl(service, branch),
    // headers: branch.headers || [],
  };
}
