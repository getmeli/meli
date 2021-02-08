import { Branch } from '../../entities/sites/branch';
import { Site } from '../../entities/sites/site';

export const CADDY_CONFIG_SITES_ID = 'sites';
export const CADDY_CONFIG_TLS_ID = 'tls';
export const CADDY_CONFIG_MANUAL_CERTIFICATES_ID = 'tls';

export function getBranchCaddyConfigId(site: Site, branch: Branch) {
  return `${CADDY_CONFIG_SITES_ID}_${site._id}_${branch._id}`;
}
