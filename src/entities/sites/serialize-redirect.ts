import { Branch } from './branch';
import { Site } from './site';
import { getSiteUrl } from './get-site-url';
import { getBranchUrl } from './get-branch-url';
import { formatRedirectPath, Redirect } from './redirect';

export function serializeRedirect(site: Site, branch: Branch, redirect: Redirect) {
  const isMainBranch = site.mainBranch === branch._id;
  const url = isMainBranch ? getSiteUrl(site) : getBranchUrl(site, branch);
  return {
    _id: redirect._id,
    type: redirect.type,
    path: redirect.path,
    config: redirect.config,
    url: `${url}${formatRedirectPath(redirect.path)}`,
  };
}
