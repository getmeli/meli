import { URL } from 'url';
import { getBranchDomain } from '../../entities/sites/get-branch-domain';
import { getSiteMainDomain } from '../../entities/sites/get-site-main-domain';
import { ManualSslConfiguration, Site, SiteDomain } from '../../entities/sites/site';
import { env } from '../../env/env';
import { unique } from '../../utils/arrays-utils';
import Server = Caddy.Http.Server;
import HttpServerTlsConnectionPolicy = Caddy.HttpServerTlsConnectionPolicy;
import Certificates = Caddy.Tls.Certificates;

const meliUrl = new URL(env.MELI_URL);
const meliUiUrl = new URL(env.MELI_UI_URL);

function getDomainWithBranches(domain: SiteDomain, site: Site) {
  return [
    domain.name,
    ...(domain.exposeBranches ? site.branches.map(branch => `${branch.slug}.${domain.name}`) : []),
  ];
}

export function generateManualCertificatesConfig(sites: Site[]): Certificates {
  const pemConfigs = sites.flatMap(site => (
    site.domains
      .filter(domain => domain?.sslConfiguration?.type === 'manual')
      .map(domain => ({
        certificate: (domain.sslConfiguration as ManualSslConfiguration).fullchain,
        key: (domain.sslConfiguration as ManualSslConfiguration).privateKey,
        tags: getDomainWithBranches(domain, site),
      }))
  ));

  if (pemConfigs.length === 0) {
    return undefined;
  }

  return {
    load_pem: pemConfigs,
  };
}

export function generateServerTlsConfig(sites: Site[]): Partial<Server> {
  const customDomains = sites.flatMap(site => (
    site.domains.map(domain => ({
      site,
      domain,
    }))
  ));
  const mainDomains = sites.map(site => getSiteMainDomain(site));
  const branchesDomains = sites.flatMap(site => (
    site.branches.map(branch => getBranchDomain(site, branch))
  ));
  const branchesCustomDomainsWithAutoSsl = sites.flatMap(site => (
    site.branches.flatMap(branch => (
      site.domains
        .filter(domain => domain.exposeBranches && domain.sslConfiguration?.type !== 'manual')
        .map(domain => `${branch.slug}.${domain.name}`)
    ))
  ));

  const automaticSslDomains = [
    meliUrl.hostname,
    meliUiUrl.hostname,
    ...customDomains
      .filter(({ domain }) => domain.sslConfiguration?.type === 'acme')
      .map(({ domain }) => domain.name),
    ...mainDomains,
    ...branchesDomains,
    ...branchesCustomDomainsWithAutoSsl,
  ].filter(unique);

  const customDomainsWithManualSsl = customDomains.filter(({ domain }) => (
    domain.sslConfiguration?.type !== 'acme'
  ));

  return {
    tls_connection_policies: [
      {
        match: {
          sni: automaticSslDomains,
        },
      },
      ...customDomainsWithManualSsl.map(({ site, domain }) => {
        const domains = getDomainWithBranches(domain, site);
        return ({
          match: {
            sni: domains,
          },
          certificate_selection: {
            any_tag: domains,
          },
        } as HttpServerTlsConnectionPolicy);
      }),
    ],
    automatic_https: {
      skip: customDomainsWithManualSsl.map(({ domain }) => domain.name),
      // TODO disable and test if it still works
    },
  };
}

export function generateBasicServerTlsConfig() {
  const automaticSslDomains = [meliUrl.hostname, meliUiUrl.hostname].filter(unique);

  return {
    tls_connection_policies: [
      {
        match: {
          sni: automaticSslDomains,
        },
      },
    ],
  };
}
