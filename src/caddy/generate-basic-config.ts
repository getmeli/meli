import { env } from '../env/env';
import { TLS_ENABLED } from '../runtime-constants';
import { getErrorRoutes } from './config/get-error-routes';
import { CADDY_CONFIG_MANUAL_CERTIFICATES_ID, CADDY_CONFIG_SITES_ID, CADDY_CONFIG_TLS_ID } from './config/ids';
import { generateBasicServerTlsConfig } from './config/tls/server-tls';
import { uiRoute } from './config/ui-route';
import { apiRoute } from './config/api-route';
import { fallback } from './config/fallback';

export async function generateBasicConfig(): Promise<Caddy.Root> {
  return {
    logging: {
      logs: {
        default: {
          level: 'DEBUG',
        },
      },
    },
    admin: {
      disabled: false,
      listen: '0.0.0.0:2019',
    },
    apps: {
      http: {
        servers: {
          sites: {
            '@id': CADDY_CONFIG_SITES_ID,
            listen: TLS_ENABLED ? [':443'] : [':80'],
            routes: [
              ...(env.MELI_STANDALONE ? [] : [
                apiRoute,
                uiRoute,
              ]),
              fallback,
            ],
            errors: getErrorRoutes(),
            ...(TLS_ENABLED ? generateBasicServerTlsConfig() : {}),
          },
        },
      },
      pki: {
        certificate_authorities: {
          local: {
            install_trust: false,
          },
        },
      },
      tls: TLS_ENABLED ? {
        '@id': CADDY_CONFIG_TLS_ID,
        automation: {
          policies: [{
            on_demand: true,
            ...(env.MELI_ACME_SERVER ? {
              issuers: [{
                module: 'acme',
                ca: env.MELI_ACME_SERVER,
                trusted_roots_pem_files: env.MELI_ACME_CA_PATH ? [env.MELI_ACME_CA_PATH] : undefined,
                challenges: {
                  http: {
                    disabled: true,
                  },
                  'tls-alpn': {
                    disabled: false,
                  },
                },
              }],
            } : {}),
          }],
        },
        certificates: {
          '@id': CADDY_CONFIG_MANUAL_CERTIFICATES_ID,
        },
      } : undefined,
    },
  };
}
