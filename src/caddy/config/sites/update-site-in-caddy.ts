import { Logger } from '../../../commons/logger/logger';
import { Site } from '../../../entities/sites/site';
import { TLS_ENABLED } from '../../../runtime-constants';
import { updateBranchInCaddy } from './update-branch-in-caddy';

const logger = new Logger('meli.api:caddy:sites');

export async function updateSiteInCaddy(site: Site) {
  return Promise.all(site.branches
    .map(branch => updateBranchInCaddy(site, branch)
      .catch(err => logger.error(`Could not update branch "${site._id}:${branch._id}"`, err))));

  if (TLS_ENABLED) {
    // TODO update TLS config
  }
}
