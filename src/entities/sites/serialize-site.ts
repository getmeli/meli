import { Site } from './site';
import { getSiteUrl } from './get-site-url';
import { env } from '../../env/env';

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
    hasPassword: !!site.password,
    // ?id=... forces cache refresh
    logo: site.logo ? `${env.MELI_URL}/api/v1/orgs/${site._id}/logo?id=${site.logo.id}` : undefined,
  };
}
