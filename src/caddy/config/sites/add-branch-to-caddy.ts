import { Logger } from '../../../commons/logger/logger';
import { Branch } from '../../../entities/sites/branch';
import { Site } from '../../../entities/sites/site';
import { TLS_ENABLED } from '../../../runtime-constants';
import { putCaddyConfigById } from '../caddy-basics';
import { CADDY_CONFIG_SITES_ID } from '../ids';
import { generateBranchRoute } from './generate-site-routes';

const logger = new Logger('meli.api:caddy:sites');

export async function addBranchToCaddy(site: Site, branch: Branch, config?: any) {
  await putCaddyConfigById(CADDY_CONFIG_SITES_ID, '/routes/2', config || generateBranchRoute(site, branch));
  logger.debug(`Added branch "${site._id}:${branch.slug}" to Caddy`);

  if (TLS_ENABLED) {
    // TODO add TLS config
  }
}
