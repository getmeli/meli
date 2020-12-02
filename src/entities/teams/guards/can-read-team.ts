import { Teams } from '../team';
import { AppError } from '../../../commons/errors/app-error';
import { isAdminOrOwner } from '../../../auth/guards/is-admin-or-owner';

export async function canReadTeam(teamId: string, userId: string): Promise<boolean> {
  const team = await Teams().findOne({
    _id: (teamId),
  });

  if (!team) {
    throw new AppError('Team not found');
  }

  const { orgId, members } = team;

  if (await isAdminOrOwner(userId, orgId)) {
    return true;
  }

  return members.includes(userId);
}
