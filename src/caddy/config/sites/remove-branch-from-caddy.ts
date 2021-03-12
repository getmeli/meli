import { Logger } from '../../../commons/logger/logger';
import { Branch } from '../../../entities/sites/branch';
import { Site } from '../../../entities/sites/site';
import { TLS_ENABLED } from '../../../runtime-constants';
import { deleteCaddyConfigById } from '../caddy-basics';
import { getBranchCaddyConfigId } from '../ids';

const logger = new Logger('meli.api:caddy:sites');

export async function removeBranchFromCaddy(site: Site, branch: Branch): Promise<void> {
  await deleteCaddyConfigById(getBranchCaddyConfigId(site, branch), '/');
  logger.debug(`Removed site branch "${site.name}:${branch.name}" from Caddy`);

  if (TLS_ENABLED) {
    // TODO remove TLS config
  }
}
