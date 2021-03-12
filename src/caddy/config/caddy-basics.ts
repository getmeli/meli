import axios, { Method } from 'axios';
import { performance } from 'perf_hooks';
import { Logger } from '../../commons/logger/logger';
import { env } from '../../env/env';
import { IdNotFoundError } from '../errors/IdNotFoundError';

const logger = new Logger('meli.api:caddy');

export const CADDY_AXIOS_DEFAULT_CONFIG = {
  timeout: env.MELI_HTTP_TIMEOUT,
};

export async function postCaddyConfigById(id: string, path: string, config: any) {
  try {
    await caddyRequest('POST', `/id/${id}${path || '/'}`, config);
  } catch (err) {
    mapIdNotFoundError(err, id);
  }
}

export async function putCaddyConfigById(id: string, path: string, config: any) {
  try {
    await caddyRequest('PUT', `/id/${id}${path || '/'}`, config);
  } catch (err) {
    mapIdNotFoundError(err, id);
  }
}

export async function deleteCaddyConfigById(id: string, path = '/') {
  try {
    await caddyRequest('DELETE', `/id/${id}${path || '/'}`);
  } catch (err) {
    mapIdNotFoundError(err, id);
  }
}

export async function caddyRequest(method: Method, url: string, data?: any) {
  const start = performance.now();
  await axios.request({
    ...CADDY_AXIOS_DEFAULT_CONFIG,
    baseURL: env.MELI_CADDY_ADMIN_API_URL,
    method,
    url,
    data,
  });
  const end = performance.now();
  logger.debug(`[${method}] ${url}: ${end - start}ms`);
}

function mapIdNotFoundError(err: any, id: string) {
  if (err.response?.data?.error?.startsWith('unknown object ID')) {
    throw new IdNotFoundError(id, err);
  } else {
    logger.debug(`Caddy request [${err.response?.request?.method}] ${err.response?.request?.path}`, err.response?.request?.data);
    logger.debug(`Caddy response: [${err.response?.status}]`, JSON.stringify(err.response?.data, null, 2));
    throw err;
  }
}
