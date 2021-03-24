import { object } from 'joi';
import { getUser } from '../../../auth/utils/get-user';
import { params } from '../../../commons/express-joi/params';
import { canAdminRelease } from './can-admin-release';
import { guard } from '../../../commons/express/guard';
import { $id } from '../../../utils/id';

export const canAdminReleaseGuard = [
  params(object({
    releaseId: $id,
  })),
  guard(req => {
    const user = getUser(req);
    const { releaseId } = req.params;
    return canAdminRelease(releaseId, user._id);
  }, 'You are not allowed to access this release'),
];
