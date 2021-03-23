import { guard } from '../../../commons/express/guard';
import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { getUser } from '../../../auth/utils/get-user';
import { canReadTeam } from './can-read-team';
import { $id } from '../../../utils/id';

export const canReadTeamGuard = [
  params(object({
    teamId: $id,
  })),
  guard(req => {
    const user = getUser(req);
    const { teamId } = req.params;
    return canReadTeam(teamId, user._id);
  }, 'Cannot get team'),
];
