import { env } from '../../env/env';
import { getReverseProxyDial } from '../utils/get-reverse-proxy-dial';
import { URL } from 'url';

const meliuihost = new URL(env.MELI_UI_URL);

export const uiRoute = env.MELI_UI_DIR ? {
  group: 'ui',
  match: [
    {
      host: [meliuihost.hostname],
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
} : {
  group: 'ui',
  match: [
    {
      host: [meliuihost.hostname],
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
