import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { $id } from '../../../utils/id';
import { guard } from '../../../commons/express/guard';
import { Projects } from '../project';
import { isAdminOrOwner } from '../../../auth/guards/is-admin-or-owner';
import { getUser } from '../../../auth/utils/get-user';

export const canAdminProjectGuard = [
  params(object({
    projectId: $id,
  })),
  guard(
    async req => {
      const { projectId } = req.params;
      const { orgId } = await Projects().findOne({
        _id: (projectId),
      });
      const user = getUser(req);
      return isAdminOrOwner(user._id, orgId);
    },
    'Cannot administrate organization',
  ),
];
