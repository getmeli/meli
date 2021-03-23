import { Branch } from './branch';
import { Site } from './site';
import { getBranchUrl } from './get-branch-url';

export function serializeBranch(site: Site, branch: Branch) {
  return !branch ? undefined : {
    _id: branch._id,
    name: branch.name,
    release: branch.release,
    hasPassword: !!branch.password,
    url: getBranchUrl(site, branch),
    headers: branch.headers || [],
  };
}
