import { env } from '../../env/env';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { URL } from 'url';

const meliUiHost = new URL(env.MELI_UI_URL);

function serveUiStatically(): Caddy.Http.Route {
  return {
    group: 'ui',
    match: [
      {
        host: [meliUiHost.hostname],
        file: {
          root: env.MELI_UI_DIR,
          try_files: [
            '{http.request.uri.path}',
            '/index.html',
          ],
        },
      },
    ],
    handle: [
      {
        handler: 'rewrite',
        uri: '{http.matchers.file.relative}',
      },
      {
        handler: 'file_server',
        root: env.MELI_UI_DIR,
      },
    ],
  };
}

function reverseProxyUi(): Caddy.Http.Route {
  return {
    group: 'ui',
    match: [
      {
        host: [meliUiHost.hostname],
        path: ['/*'],
      },
    ],
    handle: [
      {
        handler: 'reverse_proxy',
        upstreams: [{
          dial: getReverseProxyDial(env.MELI_UI_URL_INTERNAL.toString()),
        }],
      },
    ],
    terminal: true,
  };
}

export const uiRoute = env.MELI_UI_DIR ? serveUiStatically() : reverseProxyUi();
