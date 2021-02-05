import axios from 'axios';
import { Logger } from '../commons/logger/logger';
import { Branch } from '../entities/sites/branch';
import { listBranches } from '../entities/sites/handlers/branches/list-branches';
import { Site, Sites } from '../entities/sites/site';
import { env } from '../env/env';
import { CADDY_CONFIG_SITES_ID, getBranchCaddyConfigId } from './config/ids';
import { generateBranchRoute, generateSiteRoutes } from './config/sites/generate-site-routes';
import { CADDY_AXIOS_DEFAULT_CONFIG, deleteCaddyConfigById, updateCaddyConfigById } from './config/caddy-helpers';
import { IdNotFoundError } from './errors/IdNotFoundError';
import { generateBasicConfig } from './generate-basic-config';

const logger = new Logger('meli.api:caddy');

export async function configureCaddy(): Promise<void> {
  logger.debug('Configuring Caddy...');

  await configureBasicCaddyConfig();

  const sites = await Sites().find().toArray();
  logger.debug(`Configuring ${sites.length} site${sites.length > 0 ? 's' : ''}...`);
  for (const site of sites) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await addSiteToCaddy(site);
    } catch (err) {
      logger.error(`Could not configure site: ${site._id}`, err);
    }
  }

  logger.debug('Done updating caddy config');
}

export async function configureBasicCaddyConfig() {
  const config = await generateBasicConfig();
  logger.debug('Basic Caddy configuration', JSON.stringify(config, null, 2));

  await axios.post(`${env.MELI_CADDY_ADMIN_API_URL}/load`, config, CADDY_AXIOS_DEFAULT_CONFIG);
}

export async function addSiteToCaddy(site: Site, config?: any) {
  await updateCaddyConfigById(CADDY_CONFIG_SITES_ID, '/routes/...', config || generateSiteRoutes(site));
  logger.debug(`Added site ${site._id} to Caddy`);
}

export async function updateSiteInCaddy(site: Site) {
  return Promise.all(site.branches
    .map(branch => updateBranchInCaddy(site, branch)
      .catch(err => logger.error(`Could not update branch ${site._id}:${branch._id}`, err))));
}

export async function addBranchToCaddy(site: Site, branch: Branch, config?: any) {
  await updateCaddyConfigById(CADDY_CONFIG_SITES_ID, '/routes/0', config || generateSiteRoutes(site));
  logger.debug(`Added branch "${branch.slug}" of site "${site._id}" to Caddy`);
}

export async function updateBranchInCaddy(site: Site, branch: Branch) {
  const config = generateBranchRoute(site, branch);

  try {
    await updateCaddyConfigById(getBranchCaddyConfigId(site, branch), '/', config);
    logger.debug(`Updated site "${site._id}" in Caddy`);
  } catch (err) {
    if (err instanceof IdNotFoundError) {
      await addBranchToCaddy(site, branch, config);
    } else {
      throw err;
    }
  }
}

export async function removeSiteFromCaddy(site: Site) {
  logger.debug(`Removing site "${site._id}" from Caddy`);
  // TODO delete all branches
  await deleteCaddyConfigById(`${site._id}`);
}

export async function configureSiteBranchInCaddy(site: Site, branch: Branch): Promise<void> {
  // TODO reconfigure branch only ?
  await updateSiteInCaddy(site);
  logger.debug(`Reconfigured site branch "${site._id}:${branch.name}" in Caddy`);
}

export async function removeSiteBranchFromCaddy(site: Site, branch: Branch): Promise<void> {
  // TODO reconfigure branch only ?
  await updateSiteInCaddy(site);
  logger.debug(`Reconfigured site branch ${site.name}:${branch.name} from Caddy`);
}

