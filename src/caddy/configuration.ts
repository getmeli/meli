import axios from 'axios';
import { Logger } from '../commons/logger/logger';
import { Sites } from '../entities/sites/site';
import { env } from '../env/env';
import { sequential } from '../utils/promises-utils';
import { CADDY_AXIOS_DEFAULT_CONFIG } from './config/caddy-basics';
import { addSiteToCaddy } from './config/sites/add-site-to-caddy';
import { generateBasicConfig } from './generate-basic-config';

const logger = new Logger('meli.api:caddy');

export async function configureCaddy(): Promise<void> {
  logger.debug('Configuring Caddy...');

  await configureBasicCaddyConfig();

  const sites = await Sites().find().toArray();
  logger.debug(`Configuring ${sites.length} site(s)...`);
  await sequential(
    sites.map(site => addSiteToCaddy(site)
      .catch(err => logger.error(`Could not configure site "${site._id}"`, err))),
  );

  logger.debug('Done updating Caddy config');
}

export async function configureBasicCaddyConfig() {
  const config = await generateBasicConfig();
  logger.debug('Basic Caddy configuration', JSON.stringify(config, null, 2));

  await axios.post(`${env.MELI_CADDY_ADMIN_API_URL}/load`, config, CADDY_AXIOS_DEFAULT_CONFIG);
}
