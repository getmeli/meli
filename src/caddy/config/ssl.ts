import { ManualSslConfiguration, Site } from '../../entities/sites/site';

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
  const manualCertificatesDomains = sites
    .flatMap(site => site.domains)
    .filter(domain => domain.sslConfiguration?.type !== 'acme');
  return {
    tls_connection_policies: manualCertificatesDomains.length === 0 ? undefined : manualCertificatesDomains.map(domain => ({
      match: {
        sni: [domain.name],
      },
      certificate_selection: {
        all_tags: [domain.name],
      },
    })),
    automatic_https: {
      skip: manualCertificatesDomains.map(domain => domain.name),
      // TODO disable and test if it still works
    },
  };
}
