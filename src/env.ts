import chalk from 'chalk';
import { cidrSubnet } from 'ip';
import {
  array, boolean, number, string,
} from 'joi';
import { tmpdir } from 'os';
import { EnvSpec, parseEnv } from './commons/env/parse-env';
import {
  commaSeparatedStringToArray, stringToBoolean, stringToInt,
} from './commons/env/transformers';
import { AppError } from './commons/errors/app-error';
import { isUrl } from './commons/validators/is-url';

export interface Env {
  DEBUG: string;
  MELI_PORT: number;
  MELI_HOST: string;
  MELI_HOST_INTERNAL: string;
  MELI_UI_HOST: string;
  MELI_UI_HOST_INTERNAL: string;
  MELI_UI_DIR: string;
  MELI_SITES_HOST: string;
  MELI_JWT_SECRET: string;
  MELI_JWT_TOKEN_EXPIRATION: number;
  MELI_MONGO_URI: string;
  MELI_GITLAB_URL: string;
  MELI_GITLAB_CLIENT_ID: string;
  MELI_GITLAB_CLIENT_SECRET: string;
  MELI_GITLAB_GROUPS: string[];
  MELI_GITEA_URL: string;
  MELI_GITEA_CLIENT_ID: string;
  MELI_GITEA_CLIENT_SECRET: string;
  MELI_GITEA_ORGS: string[];
  MELI_GITHUB_URL: string;
  MELI_GITHUB_CLIENT_ID: string;
  MELI_GITHUB_CLIENT_SECRET: string;
  MELI_GITHUB_ORGS: string[];
  MELI_GOOGLE_CLIENT_ID: string;
  MELI_GOOGLE_CLIENT_SECRET: string;
  MELI_MIGRATE_ROLLBACK: boolean;
  MELI_SSL_KEY: string;
  MELI_SSL_CERT: string;
  MELI_COOKIE_SAMESITE: boolean;
  MELI_COOKIE_SECURE: boolean;
  MELI_RATE_LIMIT_WINDOW: number;
  MELI_RATE_LIMIT_MAX_PER_WINDOW: number;
  MELI_PROMETHEUS_HOST: string;
  MELI_PROMETHEUS_PORT: number;
  MELI_PROMETHEUS_REFRESH_RATE: number;
  MELI_PROMETHEUS_METRICS_PREFIX: string;
  MELI_REDIS_URL: string;
  MELI_HOOK_TIMEOUT: number;
  MELI_MAIL_HOST: string;
  MELI_MAIL_PORT: number;
  MELI_MAIL_USERNAME: number;
  MELI_MAIL_PASSWORD: number;
  MELI_MAIL_FROM: string;
  MELI_MAIL_TEMPLATE_DIR: string;
  MELI_MAIL_SUBJECT_PREFIX: string;
  MELI_SENTRY_ENABLED: boolean;
  MELI_RESTRICTED_IPS: string[];
  MELI_RESTRICTED_DOMAINS: string[];
  MELI_CADDY_DOCKER: boolean;
  MELI_CADDY_ADMIN_API_URL: string;
  // Caddy content path
  MELI_CADDY_DIR: string;
  MELI_TMP_DIRECTORY: string;
  MELI_SITES_DIR: string;
  MELI_INVITE_EXPIRATION_TIME: number;
  MELI_STATIC_DIR: string;
  MELI_BCRYPT_SALTROUNDS: number;
  MELI_ACME_SERVER: string;
  MELI_ACME_CA_PATH: string;
}

const envSpec: EnvSpec<Env> = {
  DEBUG: {
    schema: string(),
  },
  MELI_PORT: {
    transform: stringToInt(),
    schema: number().default(3001),
  },
  MELI_HOST: {
    schema: string().required(),
  },
  MELI_HOST_INTERNAL: {
    schema: string().optional().custom(isUrl).default(process.env.MELI_HOST),
  },
  MELI_UI_HOST: {
    schema: string().optional().custom(isUrl).default(process.env.MELI_HOST),
  },
  MELI_UI_HOST_INTERNAL: {
    schema: string().optional().custom(isUrl).default(process.env.MELI_HOST),
  },
  MELI_SITES_HOST: {
    schema: string().optional().custom(isUrl).default(process.env.MELI_HOST),
  },
  MELI_UI_DIR: {
    schema: string().optional(),
  },
  MELI_JWT_SECRET: {
    schema: string(),
  },
  MELI_JWT_TOKEN_EXPIRATION: {
    transform: stringToInt(),
    schema: number().min(3600).default(86400 * 30),
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
    schema: string(),
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
  MELI_SSL_KEY: {
    schema: string(),
  },
  MELI_SSL_CERT: {
    schema: string(),
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
    schema: string().required(),
  },
  MELI_MAIL_PORT: {
    transform: stringToInt(),
    schema: number().required(),
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
    schema: string().optional().default('./emails/templates'),
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
  // whether Caddy is running in an external Docker container
  MELI_CADDY_DOCKER: {
    transform: stringToBoolean(),
    schema: boolean().default(true),
  },
  MELI_CADDY_DIR: {
    schema: string().optional().default('/sites'),
  },
  MELI_SITES_DIR: {
    schema: string().required().default('/sites'),
  },
  MELI_CADDY_ADMIN_API_URL: {
    schema: string().default('http://localhost:2019'),
  },
  MELI_TMP_DIRECTORY: {
    schema: string().optional().default(tmpdir()),
  },
  MELI_STATIC_DIR: {
    schema: string().optional().default('./public'),
  },
  MELI_INVITE_EXPIRATION_TIME: {
    transform: stringToInt(),
    schema: number().optional().default(86400000),
  },
  MELI_BCRYPT_SALTROUNDS: {
    transform: stringToInt(),
    schema: number().optional().default(10),
  },
  MELI_ACME_SERVER: {
    schema: string().optional().custom(isUrl),
  },
  MELI_ACME_CA_PATH: {
    schema: string().optional(),
  },
};

export const env: Env = parseEnv(envSpec);
