import { guard } from '../../../commons/express/guard';
import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { getUser } from '../../../auth/utils/get-user';
import { canAdminSite } from './can-admin-site';
import { $id } from '../../../utils/id';

export const canAdminSiteGuard = [
  params(object({
    siteId: $id,
  })),
  guard(req => {
    const user = getUser(req);
    const { siteId } = req.params;
    return canAdminSite(siteId, user._id);
  }, 'Cannot delete team'),
];
