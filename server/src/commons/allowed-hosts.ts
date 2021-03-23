import { URL } from 'url';
import { isIP } from 'net';
import { Logger } from './logger/logger';
import { promises } from 'dns';
import { cidrSubnet } from 'ip';

const logger = new Logger('meli.api:allowedHosts');

function ipMatch(ip: string, ranges: string[]) {
  return ranges
    .map(ipOrRange => cidrSubnet(ipOrRange))
    .some(subnet => subnet.contains(ip));
}

export interface AllowedHosts {
  host: string;
  ips: string[];
}

/**
 * Returns the list of IPs that are allowed for calling the given url. Also returns the host to use in headers and
 * as server name. See https://stackoverflow.com/questions/53522723/https-request-specifying-hostname-and-specific-ip-address.
 * @param url
 * @param restrictedIps
 * @param restrictedDomains
 */
export async function allowedHosts(url: string, restrictedIps: string[], restrictedDomains: string[]): Promise<AllowedHosts> {
  logger.debug('computing allowed hosts for url', url, '; restrictedIps', restrictedIps, '; restrictedDomains', restrictedDomains);

  const urlObject = new URL(url);

  logger.debug(urlObject);

  const { hostname } = urlObject;

  logger.debug('parsed hostname', hostname, 'for url', url);

  let ips: string[];

  if (isIP(hostname)) {
    ips = [hostname];
  } else { // it's a domain ?
    const isRestrictedDomain = restrictedDomains
      .map(domain => new RegExp(domain))
      .some(regex => regex.test(hostname));

    if (isRestrictedDomain) {
      logger.debug('hostname', hostname, 'is in', restrictedDomains, 'and hence is not allowed');
      return {
        host: hostname,
        ips: [],
      };
    }

    try {
      ips = await promises.resolve(hostname);
    } catch (e) {
      throw new Error(`Could not resolve ${url}`);
    }
  }

  logger.debug('hostname', hostname, 'resolved to ips', ips);

  const allowedIps = ips.filter(ip => !ipMatch(ip, restrictedIps));

  logger.debug('allowing ips', allowedIps, 'from resolved ips', ips);
  return {
    host: hostname,
    ips: allowedIps,
  };
}
