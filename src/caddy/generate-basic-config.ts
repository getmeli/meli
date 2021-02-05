import { env } from '../env/env';
import { getErrorRoutes } from './config/get-error-routes';
import { CADDY_CONFIG_SITES_ID } from './config/ids';
import { generateBasicServerTlsConfig } from './config/ssl';
import { uiRoute } from './config/ui-route';
import { apiRoute } from './config/api-route';
import { URL } from 'url';
import { fallback } from './config/fallback';
import { Logger } from '../commons/logger/logger';

const logger = new Logger('meli.api.caddy:generateConfig');

const sitesUrl = new URL(env.MELI_SITES_URL);

export async function generateBasicConfig(): Promise<any> {
  const sslEnabled = sitesUrl.protocol === 'https:' && env.MELI_HTTPS_AUTO;

  logger.debug('sslEnabled', sslEnabled);

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
            listen: sslEnabled ? [':443'] : [':80'],
            routes: [
              ...(env.MELI_STANDALONE ? [] : [
                apiRoute,
                uiRoute,
              ]),
              fallback,
            ],
            errors: getErrorRoutes(),
            ...(sslEnabled ? generateBasicServerTlsConfig() : {}),
          },
        },
      },
      tls: sslEnabled ? {
        automation: {
          policies: [
            ...(!env.MELI_ACME_SERVER ? [] : [{
              issuer: {
                module: 'acme',
                ca: env.MELI_ACME_SERVER,
                trusted_roots_pem_files: env.MELI_ACME_CA_PATH ? [env.MELI_ACME_CA_PATH] : undefined,
              },
              on_demand: true,
            }]),
          ],
        },
        certificates: [],
      } : undefined,
    },
  };
}
