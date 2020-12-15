import { URL } from 'url';
import { getBranchDomain } from '../../entities/sites/get-branch-domain';
import { getSiteDomain } from '../../entities/sites/get-site-domain';
import { ManualSslConfiguration, Site } from '../../entities/sites/site';
import { env } from '../../env/env';
import { unique } from '../../utils/arrays-utils';

const meliUrl = new URL(env.MELI_URL);
const meliUiUrl = new URL(env.MELI_UI_URL);

export function generateManualCertificatesConfig(sites: Site[]) {
  const domains = sites
    .flatMap(site => site.domains)
    .filter(domain => domain?.sslConfiguration?.type === 'manual');

  if (domains.length === 0) {
    return undefined;
  }

  return {
    load_pem: domains.map(domain => ({
      certificate: (domain.sslConfiguration as ManualSslConfiguration).fullchain,
      key: (domain.sslConfiguration as ManualSslConfiguration).privateKey,
      tags: [domain.name], // TODO id?
    })),
  };
}

export function generateServerTlsConfig(sites: Site[]) {
  const sitesCustomDomains = sites.flatMap(site => site.domains);
  const sitesMainDomainNames = sites
    .map(site => getSiteDomain(site));
  const sitesBranchesDomainNames = sites
    .flatMap(site => site.branches
      .map(branch => getBranchDomain(site, branch)));
  const acmeDomainNames = [
    meliUrl.hostname,
    meliUiUrl.hostname,
    ...sitesCustomDomains
      .filter(domain => domain.sslConfiguration?.type === 'acme')
      .map(domain => domain.name),
    ...sitesMainDomainNames,
    ...sitesBranchesDomainNames,
  ].filter(unique);
  const manualCertificatesDomains = sitesCustomDomains
    .filter(domain => domain.sslConfiguration?.type !== 'acme');

  return {
    tls_connection_policies: [
      {
        match: {
          sni: acmeDomainNames,
        },
      },
      ...manualCertificatesDomains.map(domain => ({
        match: {
          sni: [domain.name],
        },
        certificate_selection: {
          all_tags: [domain.name],
        },
      })),
    ],
    automatic_https: {
      skip: manualCertificatesDomains.map(domain => domain.name),
      // TODO disable and test if it still works
    },
  };
}
