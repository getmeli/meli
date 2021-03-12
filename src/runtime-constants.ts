import { URL } from 'url';
import { env } from './env/env';

export const SITES_URL = new URL(env.MELI_SITES_URL);
export const MELI_URL = new URL(env.MELI_URL);
export const MELI_UI_URL = new URL(env.MELI_UI_URL);

export const TLS_ENABLED = SITES_URL.protocol === 'https:' && env.MELI_HTTPS_AUTO;
