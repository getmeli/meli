import { Site } from './site';
import { getSiteUrl } from './get-site-url';
import { Branch } from './branch';
import { Redirect } from './redirect';
import { getBranchUrl } from './get-branch-url';

export function getRedirectUrl(site: Site, branch: Branch, rediret: Redirect): string {
  const isMainBranch = site.mainBranch === branch._id;
  const branchUrl = isMainBranch ? getSiteUrl(site) : getBranchUrl(site, branch);
  return `${branchUrl}${rediret.path}`;
}
