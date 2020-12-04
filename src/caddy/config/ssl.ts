import { ManualSslConfiguration, Site } from '../../entities/sites/site';

export function generateManualCertificatesConfig(sites: Site[]) {
  const domains = sites
    .flatMap(site => site.domains)
    .filter(domain => domain?.sslConfiguration?.type === 'manual');

  return {
    load_pem: domains.map(domain => ({
      certificate: (domain.sslConfiguration as ManualSslConfiguration).fullchain,
      key: (domain.sslConfiguration as ManualSslConfiguration).privateKey,
      tags: [domain.name], // TODO id?
    })),
  };
}

export function generateServerTlsConfig(sites: Site[]) {
  const domains = [
    ...sites.flatMap(site => site.domains),
    // TODO default domains
  ];
  return {
    tls_connection_policies: domains.map(domain => ({
      match: {
        sni: [domain.name],
      },
      certificate_selection: {
        all_tags: [/* TODO */],
      },
    })),
    automatic_https: {
      skip: domains
        .filter(domain => domain.sslConfiguration?.type !== 'acme')
        .map(domain => domain.name),
      // TODO disable and test if it still works
    },
  };
}
