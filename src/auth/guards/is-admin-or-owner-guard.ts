import { object } from 'joi';
import { isAdminOrOwner } from './is-admin-or-owner';
import { guard } from '../../commons/express/guard';
import { getUser } from '../utils/get-user';
import { params } from '../../commons/express-joi/params';
import { $id } from '../../utils/id';

export const isAdminOrOwnerGuard = [
  params(object({
    orgId: $id,
  })),
  guard(req => {
    const user = getUser(req);
    const { orgId } = req.params;
    return isAdminOrOwner(user._id, orgId);
  }, 'Cannot admin team members'),
];
