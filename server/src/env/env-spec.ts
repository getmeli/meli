import { EnvSpec } from '../commons/env/parse-env';
import { array, boolean, number, object, string } from 'joi';
import { commaSeparatedStringToArray, stringToBoolean, stringToInt, stringToJson } from '../commons/env/transformers';
import { isUrl } from '../commons/validators/is-url';
import { AppError } from '../commons/errors/app-error';
import chalk from 'chalk';
import path, { join } from 'path';
import { cidrSubnet } from 'ip';
import { tmpdir } from 'os';
import { Env } from './env';
import { MulterLimitOptions } from '../commons/multer/types';

const resolvePath = val => (val ? path.resolve(val) : val);
export const envSpec: EnvSpec<Env> = {
  DEBUG: {
    schema: string().optional(),
  },
  MELI_PORT: {
    transform: stringToInt(),
    schema: number().default(3001),
  },
  MELI_URL: {
    schema: string().required(),
  },
  MELI_URL_INTERNAL: {
    schema: string().optional().custom(isUrl).default(process.env.MELI_URL || null),
  },
  MELI_UI_URL_INTERNAL: {
    schema: string().optional().custom(isUrl).default(process.env.MELI_URL || null),
  },
  MELI_SITES_URL: {
    schema: string().optional().custom(isUrl).default(process.env.MELI_URL || null),
  },
  MELI_HTTPS_AUTO: {
    transform: stringToBoolean(),
    schema: boolean().optional().default(true),
  },
  MELI_STANDALONE: {
    transform: stringToBoolean(),
    schema: boolean().optional().default(false),
  },
  MELI_UI_DIR: {
    schema: string().optional().custom(resolvePath),
  },
  MELI_JWT_SECRET: {
    schema: string().required(),
  },
  MELI_JWT_TOKEN_EXPIRATION: {
    transform: stringToInt(),
    schema: number().min(3600).default(86400 * 30 * 1000),
  },
  MELI_GITLAB_URL: {
    schema: string().default('https://gitlab.com'),
  },
  MELI_GITLAB_CLIENT_ID: {
    schema: string(),
  },
  MELI_GITLAB_CLIENT_SECRET: {
    schema: string(),
  },
  MELI_GITEA_URL: {
    schema: string().default('https://gitea.com'),
  },
  MELI_GITEA_CLIENT_ID: {
    schema: string(),
  },
  MELI_GITEA_CLIENT_SECRET: {
    schema: string(),
  },
  MELI_GITHUB_URL: {
    schema: string().default('https://github.com'),
  },
  MELI_GITHUB_CLIENT_ID: {
    schema: string(),
  },
  MELI_GITHUB_CLIENT_SECRET: {
    schema: string(),
  },
  MELI_GOOGLE_CLIENT_ID: {
    schema: string().optional(),
  },
  MELI_GOOGLE_CLIENT_SECRET: {
    schema: string().optional(),
  },
  MELI_MONGO_URI: {
    schema: string().optional(),
  },
  MELI_MONGO_USER: {
    schema: string().optional(),
  },
  MELI_MONGO_PASSWORD: {
    schema: string().optional(),
  },
  MELI_MONGO_HOST: {
    schema: string().optional(),
  },
  MELI_MONGO_PORT: {
    schema: number().optional().default(27017),
  },
  MELI_MONGO_DB: {
    schema: string().optional(),
  },
  MELI_MIGRATE_ROLLBACK: {
    transform: stringToBoolean(),
    schema: boolean().default(false),
  },
  MELI_GITHUB_ORGS: {
    transform: commaSeparatedStringToArray(),
    schema: array().optional().min(0)
      .items(
        string().trim().required(),
      ),
  },
  MELI_GITEA_ORGS: {
    transform: commaSeparatedStringToArray(),
    schema: array().optional().min(0)
      .items(
        string().trim().required(),
      ),
  },
  MELI_GITLAB_GROUPS: {
    transform: commaSeparatedStringToArray(),
    schema: array().optional().min(0)
      .items(
        string().trim().required(),
      ),
  },
  MELI_COOKIE_SAMESITE: {
    schema: string().default(null),
  },
  MELI_COOKIE_SECURE: {
    transform: stringToBoolean(),
    schema: boolean().default(false),
  },
  MELI_RATE_LIMIT_WINDOW: {
    transform: stringToInt(),
    schema: number().default(60 * 1000), // 1 minutes
  },
  MELI_RATE_LIMIT_MAX_PER_WINDOW: {
    transform: stringToInt(),
    schema: number().default(100),
  },
  MELI_PROMETHEUS_HOST: {
    schema: string().optional().default('localhost'),
  },
  MELI_PROMETHEUS_PORT: {
    transform: stringToInt(),
    schema: number().min(0).default(3002).custom(port => {
      if (port === process.env.MELI_PORT) {
        throw new AppError(
          `${chalk.blue('MELI_PROMETHEUS_PORT')} must be different than ${chalk.blue('MELI_PORT')}`,
        );
      }
      return port;
    }),
  },
  MELI_PROMETHEUS_REFRESH_RATE: {
    transform: stringToInt(),
    schema: number().min(10000).default(10000), // 10 seconds
  },
  MELI_PROMETHEUS_METRICS_PREFIX: {
    schema: string().default('meli_server_'),
  },
  MELI_REDIS_URL: {
    schema: string().optional(),
  },
  MELI_HOOK_TIMEOUT: {
    transform: stringToInt(),
    schema: number().min(1000).default(5000),
  },
  MELI_MAIL_HOST: {
    schema: string().optional(),
  },
  MELI_MAIL_PORT: {
    transform: stringToInt(),
    schema: number().optional(),
  },
  MELI_MAIL_USERNAME: {
    schema: string().optional(),
  },
  MELI_MAIL_PASSWORD: {
    schema: string().optional(),
  },
  MELI_MAIL_FROM: {
    schema: string().optional(),
  },
  MELI_MAIL_SUBJECT_PREFIX: {
    schema: string().optional().default('Meli |'),
  },
  MELI_MAIL_TEMPLATE_DIR: {
    schema: string().optional().default(join(__dirname, './emails/templates')).custom(resolvePath),
  },
  MELI_SENTRY_ENABLED: {
    transform: stringToBoolean(),
    schema: boolean().default(true),
  },
  MELI_RESTRICTED_IPS: {
    transform: commaSeparatedStringToArray(),
    schema: array().optional().default([]).min(0)
      .items(
        string().required().custom(value => {
          try {
            cidrSubnet(value);
          } catch (e) {
            throw new Error(`Invalid IP or IP range: ${e}`);
          }
          return value;
        }),
      ),
  },
  MELI_RESTRICTED_DOMAINS: {
    transform: commaSeparatedStringToArray(),
    schema: array().optional().default([]).min(0)
      .items(
        string().required(),
      ),
  },
  MELI_CADDY_DIR: {
    schema: string().optional().default('/sites').custom(resolvePath),
  },
  MELI_SITES_DIR: {
    schema: string().optional().default('/sites').custom(resolvePath),
  },
  MELI_STORAGE_DIR: {
    schema: string().optional().default('/files').custom(resolvePath),
  },
  MELI_CADDY_ADMIN_API_URL: {
    schema: string().default('http://localhost:2019'),
  },
  MELI_TMP_DIRECTORY: {
    schema: string().optional().default(tmpdir()).custom(resolvePath),
  },
  MELI_INVITE_EXPIRATION_TIME: {
    transform: stringToInt(),
    schema: number().optional().default(86400000),
  },
  MELI_ACME_SERVER: {
    schema: string().optional().custom(isUrl),
  },
  MELI_ACME_CA_PATH: {
    schema: string().optional(),
  },
  MELI_HTTP_TIMEOUT: {
    transform: stringToInt(),
    schema: number().optional().default(10000),
  },
  MELI_USER: {
    schema: string().optional(),
  },
  MELI_PASSWORD: {
    schema: string().optional(),
  },
  MELI_MAX_ORGS: {
    transform: stringToInt(),
    schema: number().optional().default(1),
  },
  MELI_MULTER_LIMITS: {
    transform: stringToJson(err => {
      throw new Error(`Invalid multer options: ${err}`);
    }),
    schema: object().optional().default(<MulterLimitOptions>{}),
  },
  MELI_MULTER_FORM_LIMITS: {
    transform: stringToJson(err => {
      throw new Error(`Invalid multer options: ${err}`);
    }),
    schema: object().optional().default(<MulterLimitOptions>{}),
  },
  MELI_GOOGLE_RECAPTCHA_SITE_KEY: {
    schema: string().optional(),
  },
  MELI_GOOGLE_RECAPTCHA_SECRET_KEY: {
    schema: string().optional(),
  },
  MELI_SAML_ENDPOINT: {
    schema: string().optional(),
  },
  MELI_SAML_ISSUER: {
    schema: string().optional(),
  },
  MELI_SAML_IDP_CRT: {
    schema: string().optional(),
  },
  MELI_SAML_PRIVATE_CRT: {
    schema: string().optional(),
  },
};
