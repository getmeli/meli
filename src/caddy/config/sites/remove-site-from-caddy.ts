import { Logger } from '../../../commons/logger/logger';
import { Site } from '../../../entities/sites/site';
import { TLS_ENABLED } from '../../../runtime-constants';
import { deleteAllCaddyConfigById } from '../caddy-utils';
import { CADDY_CONFIG_MANUAL_CERTIFICATES_ID, CADDY_CONFIG_MANUAL_CERTIFICATES_POLICIES_ID } from '../ids';
import { reconfigureAutomaticCertificatesDomains } from '../tls/server-tls';
import { removeBranchFromCaddy } from './remove-branch-from-caddy';

const logger = new Logger('meli.api:caddy:sites');

export async function removeSiteFromCaddy(site: Site): Promise<void> {
  logger.debug(`Deleting site "${site._id}" from Caddy...`);

  await Promise.all(site.branches
    .map(branch => removeBranchFromCaddy(site, branch)
      .catch(err => logger.error(`Could not delete branch "${site._id}:${branch._id}"`, err))));

  if (TLS_ENABLED) {
    await reconfigureAutomaticCertificatesDomains();
    await deleteAllCaddyConfigById(`${CADDY_CONFIG_MANUAL_CERTIFICATES_POLICIES_ID}_${site._id}`);
    await deleteAllCaddyConfigById(`${CADDY_CONFIG_MANUAL_CERTIFICATES_ID}_${site._id}`);
  }

  logger.debug(`Site "${site._id}" deleted from Caddy`);
}
