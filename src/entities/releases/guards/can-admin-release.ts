import { Releases } from '../release';
import { canAdminSite } from '../../sites/guards/can-admin-site';

export async function canAdminRelease(releaseId: string, userId: string): Promise<boolean> {
  const { siteId } = await Releases().findOne({
    _id: releaseId,
  });
  return canAdminSite(siteId, userId);
}
