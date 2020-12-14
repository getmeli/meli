import { Site } from './site';
import { getSiteUrl } from './get-site-url';

export function serializeSite(site: Site) {
  return {
    _id: site._id,
    teamId: site.teamId,
    color: site.color,
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
    name: site.name,
    mainBranch: site.mainBranch,
    domains: site.domains || [],
    branches: site.branches || [],
    url: getSiteUrl(site),
    spa: site.spa,
  };
}
