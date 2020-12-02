import { getUser } from '../../../auth/utils/get-user';
import { guard } from '../../../commons/express/guard';
import { isOrgMember } from './is-org-member';
import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { $id } from '../../../utils/id';

export const isOrgMemberGuard = [
  params(object({
    orgId: $id,
  })),
  guard(
    req => {
      const { _id } = getUser(req);
      const { orgId } = req.params;
      return isOrgMember(_id, orgId);
    },
    'Not allowed to read org',
  ),
];
