import { URL } from 'url';
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
  const sitesDomains = sites.flatMap(site => site.domains);
  const acmeDomains = [
    meliUrl.hostname,
    meliUiUrl.hostname,
    ...sitesDomains
      .filter(domain => domain.sslConfiguration?.type === 'acme')
      .map(domain => domain.name),
  ].filter(unique);
  const manualCertificatesDomains = sitesDomains
    .filter(domain => domain.sslConfiguration?.type !== 'acme');

  return {
    tls_connection_policies: [
      {
        match: {
          sni: acmeDomains,
        },
        // TODO if manual certificate was given for meli, use it (leave as is for acme)
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
