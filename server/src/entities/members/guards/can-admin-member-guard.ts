import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { $id } from '../../../utils/id';
import { Members } from '../member';
import { getUser } from '../../../auth/utils/get-user';
import { guard } from '../../../commons/express/guard';
import { isAdminOrOwner } from '../../../auth/guards/is-admin-or-owner';

export const canAdminMemberGuard = [
  params(object({
    memberId: $id,
  })),
  guard(
    async req => {
      const { memberId } = req.params;
      const user = getUser(req);
      const { orgId } = await Members().findOne({ _id: memberId });
      return isAdminOrOwner(user._id, orgId);
    },
    'Cannot admin member',
  ),
];
