import { canReadTeam } from '../../teams/guards/can-read-team';
import { Sites } from '../site';

export async function canAdminSite(siteId: string, userId: string): Promise<boolean> {
  const { teamId } = await Sites().findOne({
    _id: siteId,
  });
  return canReadTeam(teamId, userId);
}
