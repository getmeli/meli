import { Site } from './site';
import { getSiteUrl } from './get-site-url';
import { getLogoUrl } from '../../utils/get-logo-url';
import { serializeBranch } from './serialize-branch';

export function serializeSite(site: Site): any {
  return {
    _id: site._id,
    teamId: site.teamId,
    color: site.color,
    logo: getLogoUrl('sites', site),
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
    name: site.name,
    mainBranch: site.mainBranch,
    domains: site.domains || [],
    branches: site.branches?.map(branch => serializeBranch(site, branch)) || [],
    url: getSiteUrl(site),
    spa: site.spa,
    hasPassword: !!site.password,
    headers: site.headers || [],
  };
}
