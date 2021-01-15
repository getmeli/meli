import { parseEnv } from '../src/commons/env/parse-env';
import { Env } from '../src/env/env';
import { envSpec } from '../src/env/env-spec';

export const testEnv: Env = parseEnv(envSpec, {
  MELI_PORT: 9999,
  // MELI_SITES_URL: 'https://melilive.mocked',
  MELI_URL: 'https://meli.mocked/api',
  // MELI_UI_URL: 'https://meli.mocked',
  // MELI_UI_URL_INTERNAL: 'https://meliui.mocked',
  // MELI_URL_INTERNAL:  'https://meliapi.mocked',
  MELI_JWT_SECRET: 'badsecret',
  MELI_MONGO_URI: 'mongodb://mocked:27017/mocked',
  MELI_USER: 'user',
  MELI_PASSWORD: 'password',
  MELI_SENTRY_ENABLED: false,
} as Partial<Env>);
