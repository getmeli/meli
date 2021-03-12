import { Branch } from '../../entities/sites/branch';
import { Site } from '../../entities/sites/site';

export const CADDY_CONFIG_SITES_ID = 'sites';
export const CADDY_CONFIG_TLS_ID = 'tls';
export const CADDY_CONFIG_AUTOMATIC_CERTIFICATES_POLICY_ID = 'automatic_certificates_policy';
export const CADDY_CONFIG_MANUAL_CERTIFICATES_POLICIES_ID = 'manual_certificates_policies';
export const CADDY_CONFIG_MANUAL_CERTIFICATES_ID = 'manual_certificates';
export const CADDY_CONFIG_FALLBACK_ROUTE_ID = 'route_fallback';

export function getBranchCaddyConfigId(site: Site, branch: Branch) {
  return `${CADDY_CONFIG_SITES_ID}_${site._id}_${branch._id}`;
}
