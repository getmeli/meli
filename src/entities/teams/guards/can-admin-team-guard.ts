import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { $id } from '../../../utils/id';
import { guard } from '../../../commons/express/guard';
import { Teams } from '../team';
import { isAdminOrOwner } from '../../../auth/guards/is-admin-or-owner';
import { getUser } from '../../../auth/utils/get-user';

export const canAdminTeamGuard = [
  params(object({
    teamId: $id,
  })),
  guard(
    async req => {
      const { teamId } = req.params;
      const { orgId } = await Teams().findOne({
        _id: (teamId),
      });
      const user = getUser(req);
      return isAdminOrOwner(user._id, orgId);
    },
    'Cannot admin ord',
  ),
];
