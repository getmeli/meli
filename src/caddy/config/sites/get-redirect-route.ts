import { Site } from '../../../entities/sites/site';
import { Branch } from '../../../entities/sites/branch';
import { FileRedirectConfig, Redirect, RedirectType, ReverseProxyRedirectConfig } from '../../../entities/sites/redirect';
import { getBranchDirInCaddy, getBranchFileRedirectDirInCaddy, getFileRedirectFileName } from '../../../entities/sites/get-site-dir';
import { URL } from 'url';
import { getReverseProxyDial } from '../../utils/get-reverse-proxy-dial';

export function getRedirectRoute(site: Site, branch: Branch, redirect: Redirect) {
  return {
    match: [{
      // https://caddyserver.com/docs/json/apps/http/servers/routes/match/path/
      path: [redirect.path],
    }],
    handle: getRedirectHandler(site, branch, redirect),
  };
}

function getRedirectHandler(site: Site, branch: Branch, redirect: Redirect) {
  switch (redirect.type) {
    case RedirectType.file:
      return getFileRedirectHandler(site, branch, redirect);
    case RedirectType.reverse_proxy:
      return getReverseProxyRedirectPath(site, branch, redirect);
    default:
      return {
        handler: 'file_server',
        root: getBranchDirInCaddy(site._id, branch),
      };
  }
}

function getFileRedirectHandler(site: Site, branch: Branch, redirect: Redirect<FileRedirectConfig>) {
  return [
    {
      // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/rewrite/
      handler: 'rewrite',
      uri: getFileRedirectFileName(redirect),
    },
    {
      handler: 'file_server',
      root: getBranchFileRedirectDirInCaddy(site._id, branch),
    },
  ];
}

function getReverseProxyRedirectPath(site: Site, branch: Branch, redirect: Redirect<ReverseProxyRedirectConfig>) {
  return [
    ...(!redirect.config.stripPathPrefix ? [] : [{
      // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/rewrite/
      handler: 'rewrite',
      strip_path_prefix: redirect.config.stripPathPrefix,
    }]),
    {
      // https://caddyserver.com/docs/json/apps/http/servers/routes/handle/reverse_proxy/
      handler: 'reverse_proxy',
      transport: {
        protocol: 'http',
        tls: new URL(redirect.config.url).protocol === 'https:' ? {} : undefined,
      },
      upstreams: [{
        dial: getReverseProxyDial(redirect.config.url),
      }],
      headers: {
        request: {
          add: {
            host: [new URL(redirect.config.url).host],
            'X-Proxied-By': ['Meli/Caddy'],
          },
        },
      },
    },
  ];
}
