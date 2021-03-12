import { getBranchDomain } from '../../../entities/sites/get-branch-domain';
import { getSiteMainDomain } from '../../../entities/sites/get-site-main-domain';
import { getDomainWithBranches } from '../../../entities/sites/helpers/domains';
import { Site, Sites } from '../../../entities/sites/site';
import { MELI_UI_URL, MELI_URL } from '../../../runtime-constants';
import { unique } from '../../../utils/arrays-utils';
import { postCaddyConfigById } from '../caddy-basics';
import { CADDY_CONFIG_AUTOMATIC_CERTIFICATES_POLICY_ID, CADDY_CONFIG_MANUAL_CERTIFICATES_POLICIES_ID } from '../ids';
import HttpServerTlsConnectionPolicy = Caddy.HttpServerTlsConnectionPolicy;

const automaticSslDomains = [MELI_URL.hostname, MELI_UI_URL.hostname].filter(unique);

/**
 * Used for apps/http/servers
 */
export function generateBasicServerTlsConfig(): Caddy.Http.Server {
  return {
    tls_connection_policies: [
      {
        '@id': CADDY_CONFIG_AUTOMATIC_CERTIFICATES_POLICY_ID,
        match: {
          sni: automaticSslDomains,
          // forces Caddy to use acme
        },
      },
    ],
  };
}

export async function reconfigureAutomaticCertificatesDomains(): Promise<void> {
  const sites = await Sites().find().toArray();
  const domains = sites.flatMap(getAutomaticCertificatesDomainsForSite);

  await postCaddyConfigById(CADDY_CONFIG_AUTOMATIC_CERTIFICATES_POLICY_ID, '/match', {
    sni: [
      ...automaticSslDomains,
      ...domains,
    ].filter(unique),
  });
}

/**
 * Used for apps/http/servers/[@CADDY_CONFIG_SITES_ID]/tls_connection_policies
 */
export function getManualCertificatesPoliciesForSite(site: Site): HttpServerTlsConnectionPolicy[] {
  return site.domains
    .filter(domain => domain.sslConfiguration.type === 'manual')
    .map(domain => {
      const domains = getDomainWithBranches(domain, site);
      return {
        '@id': `${CADDY_CONFIG_MANUAL_CERTIFICATES_POLICIES_ID}_${site._id}`,
        match: {
          sni: domains,
        },
        certificate_selection: {
          any_tag: domains,
        },
      };
    });
}

/**
 * Used for apps/http/servers/[@CADDY_CONFIG_SITES_ID]/tls_connection_policies/[@CADDY_CONFIG_AUTOMATIC_CERTIFICATES_POLICY_ID]/match/sni
 */
export function getAutomaticCertificatesDomainsForSite(site: Site): string[] {
  const mainDomain = getSiteMainDomain(site);
  const branchesDomains = site.branches.map(branch => getBranchDomain(site, branch));
  const customDomains = site.domains
    .filter(domain => domain.sslConfiguration?.type === 'acme')
    .map(domain => domain.name);

  return [
    mainDomain,
    ...branchesDomains,
    ...customDomains,
  ];
}
