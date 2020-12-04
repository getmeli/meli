import axios from 'axios';
import { Logger } from '../commons/logger/logger';
import { env } from '../env';
import { Site } from '../entities/sites/site';
import { Branch } from '../entities/sites/branch';
import { generateConfig } from './generate-config';

const logger = new Logger('meli.server:caddy');

export async function configureCaddy(): Promise<void> {
  logger.debug('Configuring Caddy...');
  const config = await generateConfig();
  logger.debug(JSON.stringify(config, null, 2));
  await axios.post(`${env.MELI_CADDY_ADMIN_API_URL}/load`, config);
}

export async function configureSiteInCaddy(site: Site) {
  logger.debug(`Reconfigured site ${site._id} in Caddy`);
  // TODO reconfigure site only
  await configureCaddy();
}

export async function removeSiteFromCaddy(siteId: string) {
  logger.debug(`Removing site ${siteId} from Caddy`);
  // TODO reconfigure site only
  await configureCaddy();
}

export async function configureSiteBranchInCaddy(site: Site, branch: Branch): Promise<void> {
  logger.debug(`Reconfigured site branch ${site._id}:${branch.name} in Caddy`);
  // TODO reconfigure branch only (or use another system so we don't have to reconfigure anything on publish)
  await configureCaddy();
}

export async function removeSiteBranchFromCaddy(siteId: string, channelName: string): Promise<void> {
  logger.debug(`Reconfigured site branch ${siteId}:${channelName} from Caddy`);
  // TODO reconfigure branch only (or use another system so we don't have to reconfigure anything on publish)
  await configureCaddy();
}
