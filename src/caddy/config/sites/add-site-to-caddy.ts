import { URL } from 'url';
import { Logger } from '../../../commons/logger/logger';
import { Site } from '../../../entities/sites/site';
import { env } from '../../../env/env';
import { TLS_ENABLED } from '../../../runtime-constants';
import { postCaddyConfigById, putCaddyConfigById } from '../caddy-basics';
import {
  CADDY_CONFIG_AUTOMATIC_CERTIFICATES_POLICY_ID,
  CADDY_CONFIG_MANUAL_CERTIFICATES_ID,
  CADDY_CONFIG_SITES_ID,
} from '../ids';
import { generateSiteManualCertificateConfigurations } from '../tls/app-tls';
import { getAutomaticCertificatesDomainsForSite, getManualCertificatesPoliciesForSite } from '../tls/server-tls';
import { generateSiteRoutes } from './generate-site-routes';

const logger = new Logger('meli.api:caddy:sites');

export async function addSiteToCaddy(site: Site, config?: Caddy.Http.Route[]) {
  // await postCaddyConfigById(CADDY_CONFIG_SITES_ID, '/routes/0', config || generateSiteRoutes(site));
  const routes = config || generateSiteRoutes(site);
  await Promise.all(routes
    .map(route => putCaddyConfigById(CADDY_CONFIG_SITES_ID, '/routes/2', route))); // 2 because API and UI are first
  // TODO optimize insertion? what about a global route for all sites and sites as subroutes ? or deleting fallback route to add id after?

  if (TLS_ENABLED) {
    const automaticDomains = getAutomaticCertificatesDomainsForSite(site);
    await postCaddyConfigById(CADDY_CONFIG_AUTOMATIC_CERTIFICATES_POLICY_ID, '/match/sni/...', automaticDomains);

    const manualCertificates = generateSiteManualCertificateConfigurations(site);
    if (manualCertificates.length > 0) {
      await postCaddyConfigById(CADDY_CONFIG_MANUAL_CERTIFICATES_ID, '/load_pem/...', manualCertificates);
    }

    const manualCertificatePolicies = getManualCertificatesPoliciesForSite(site);
    if (manualCertificatePolicies.length > 0) {
      await postCaddyConfigById(CADDY_CONFIG_SITES_ID, '/tls_connection_policies/...', manualCertificatePolicies);
    }
  }

  logger.debug(`Added site "${site._id}" to Caddy`);
}
