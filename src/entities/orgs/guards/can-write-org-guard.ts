import { getUser } from '../../../auth/utils/get-user';
import { guard } from '../../../commons/express/guard';
import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { $id } from '../../../utils/id';
import { isOwner } from '../../users/guards/is-owner';

export const canWriteOrgGuard = [
  params(object({
    orgId: $id,
  })),
  guard(
    req => {
      const user = getUser(req);
      const { orgId } = req.params;
      return isOwner(user._id, orgId);
    },
    'Not allowed to update org',
  ),
];
