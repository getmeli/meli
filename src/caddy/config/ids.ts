import { Branch } from '../../entities/sites/branch';
import { Site } from '../../entities/sites/site';

export const CADDY_CONFIG_SITES_ID = 'sites';

export function getBranchCaddyConfigId(site: Site, branch: Branch) {
  return `site_${site._id}_${branch._id}`;
}
