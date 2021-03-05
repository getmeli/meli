import axios from 'axios';
import { Logger } from '../../commons/logger/logger';
import { env } from '../../env/env';
import { IdNotFoundError } from '../errors/IdNotFoundError';

const logger = new Logger('meli.api:caddy');

export const CADDY_AXIOS_DEFAULT_CONFIG = {
  timeout: env.MELI_HTTP_TIMEOUT,
};

export async function postCaddyConfigById(id: string, path: string, config: any) {
  try {
    await axios.post(`${env.MELI_CADDY_ADMIN_API_URL}/id/${id}${path || '/'}`, config, CADDY_AXIOS_DEFAULT_CONFIG);
  } catch (err) {
    mapIdNotFoundError(err, id);
  }
}

export async function putCaddyConfigById(id: string, path: string, config: any) {
  try {
    await axios.put(`${env.MELI_CADDY_ADMIN_API_URL}/id/${id}${path || '/'}`, config, CADDY_AXIOS_DEFAULT_CONFIG);
  } catch (err) {
    mapIdNotFoundError(err, id);
  }
}

export async function deleteCaddyConfigById(id: string, path = '/') {
  try {
    await axios.delete(`${env.MELI_CADDY_ADMIN_API_URL}/id/${id}${path || '/'}`, CADDY_AXIOS_DEFAULT_CONFIG);
  } catch (err) {
    mapIdNotFoundError(err, id);
  }
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
