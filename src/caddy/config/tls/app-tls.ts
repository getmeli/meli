import { getDomainWithBranches } from '../../../entities/sites/helpers/domains';
import { ManualSslConfiguration, Site } from '../../../entities/sites/site';
import { CADDY_CONFIG_MANUAL_CERTIFICATES_ID } from '../ids';
import Certificates = Caddy.Tls.Certificates;

/**
 * Used for /app/tls/certificates/...
 */
export function generateSiteManualCertificateConfigurations(site: Site): Certificates.LoadPemEntry[] {
  return site.domains
    .filter(domain => domain?.sslConfiguration?.type === 'manual')
    .map(domain => ({
      '@id': `${CADDY_CONFIG_MANUAL_CERTIFICATES_ID}_${site._id}`,
      certificate: (domain.sslConfiguration as ManualSslConfiguration).fullchain,
      key: (domain.sslConfiguration as ManualSslConfiguration).privateKey,
      tags: getDomainWithBranches(domain, site),
    }));
}
