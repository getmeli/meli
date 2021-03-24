import { Releases } from '../release';
import { canAdminSite } from '../../sites/guards/can-admin-site';
import { NotFoundError } from '../../../commons/errors/not-found-error';

export async function canAdminRelease(releaseId: string, userId: string): Promise<boolean> {
  const release = await Releases().findOne({
    _id: releaseId,
  });

  if (!release) {
    throw new NotFoundError('Release not found');
  }

  return canAdminSite(release.siteId, userId);
}
