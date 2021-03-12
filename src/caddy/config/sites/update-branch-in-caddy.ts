import { Logger } from '../../../commons/logger/logger';
import { Branch } from '../../../entities/sites/branch';
import { Site } from '../../../entities/sites/site';
import { TLS_ENABLED } from '../../../runtime-constants';
import { IdNotFoundError } from '../../errors/IdNotFoundError';
import { postCaddyConfigById } from '../caddy-basics';
import { getBranchCaddyConfigId } from '../ids';
import { addBranchToCaddy } from './add-branch-to-caddy';
import { generateBranchRoute } from './generate-site-routes';

const logger = new Logger('meli.api:caddy:sites');

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

  if (TLS_ENABLED) {
    // TODO update TLS config
  }
}
