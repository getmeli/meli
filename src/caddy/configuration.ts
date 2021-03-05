import axios from 'axios';
import { Logger } from '../commons/logger/logger';
import { Branch } from '../entities/sites/branch';
import { Site, Sites } from '../entities/sites/site';
import { env } from '../env/env';
import { sequential } from '../utils/promises-utils';
import { CADDY_CONFIG_SITES_ID, getBranchCaddyConfigId } from './config/ids';
import { generateBranchRoute, generateSiteRoutes } from './config/sites/generate-site-routes';
import {
  CADDY_AXIOS_DEFAULT_CONFIG,
  deleteCaddyConfigById,
  postCaddyConfigById,
  putCaddyConfigById
} from './config/caddy-helpers';
import { IdNotFoundError } from './errors/IdNotFoundError';
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

export async function addSiteToCaddy(site: Site, config?: Caddy.Http.Route[]) {
  // await postCaddyConfigById(CADDY_CONFIG_SITES_ID, '/routes/0', config || generateSiteRoutes(site));
  const routes = config || generateSiteRoutes(site);
  await Promise.all(routes
    .map(route => putCaddyConfigById(CADDY_CONFIG_SITES_ID, '/routes/2', route))); // 2 because API and UI are first
  // TODO optimize insertion? what about a global route for all sites and sites as subroutes ? or deleting fallback route to add id after?
  logger.debug(`Added site "${site._id}" to Caddy`);
}

export async function updateSiteInCaddy(site: Site) {
  return Promise.all(site.branches
    .map(branch => updateBranchInCaddy(site, branch)
      .catch(err => logger.error(`Could not update branch "${site._id}:${branch._id}"`, err))));
}

export async function removeSiteFromCaddy(site: Site) {
  return Promise.all(site.branches
    .map(branch => removeBranchFromCaddy(site, branch)
      .catch(err => logger.error(`Could not delete branch "${site._id}:${branch._id}"`, err))));
}

export async function addBranchToCaddy(site: Site, branch: Branch, config?: any) {
  await putCaddyConfigById(CADDY_CONFIG_SITES_ID, '/routes/2', config || generateBranchRoute(site, branch));
  logger.debug(`Added branch "${site._id}:${branch.slug}" to Caddy`);
}

export async function updateBranchInCaddy(site: Site, branch: Branch) {
  const config = generateBranchRoute(site, branch);

  try {
    await postCaddyConfigById(getBranchCaddyConfigId(site, branch), '/', config);
    logger.debug(`Updated branch "${site._id}:${branch._id}" in Caddy`);
  } catch (err) {
    if (err instanceof IdNotFoundError) {
      await addBranchToCaddy(site, branch, config);
    } else {
      throw err;
    }
  }
}

export async function removeBranchFromCaddy(site: Site, branch: Branch): Promise<void> {
  await deleteCaddyConfigById(getBranchCaddyConfigId(site, branch), '/');
  logger.debug(`Removed site branch "${site.name}:${branch.name}" from Caddy`);
}
