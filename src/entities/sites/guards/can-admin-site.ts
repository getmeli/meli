import { canReadTeam } from '../../teams/guards/can-read-team';
import { Sites } from '../site';
import { NotFoundError } from '../../../commons/errors/not-found-error';

export async function canAdminSite(siteId: string, userId: string): Promise<boolean> {
  const site = await Sites().findOne({
    _id: siteId,
  });

  if (!site) {
    throw new NotFoundError('Site not found');
  }

  return canReadTeam(site.teamId, userId);
}
