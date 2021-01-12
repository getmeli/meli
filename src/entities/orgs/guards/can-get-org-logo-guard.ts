import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { $id } from '../../../utils/id';
import { Orgs } from '../org';
import { isAdminOrOwner } from '../../../auth/guards/is-admin-or-owner';
import { getUser } from '../../../auth/utils/get-user';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { ForbiddenError } from '../../../commons/errors/forbidden-error';

export const canGetOrgLogoGuard = [
  params(object({
    orgId: $id,
  })),
  wrapAsyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { orgId } = req.params;

    // check is admin or owner
    const user = getUser(req);
    const adminOrOwner = await isAdminOrOwner(user._id, orgId);
    if (adminOrOwner) {
      return next();
    }

    // check if user has an invite token
    if (req.query.invite) {
      const count = await Orgs().countDocuments({
        'invites.token': req.query.invite,
      }, {
        limit: 1,
      });

      if (count !== 0) {
        return next();
      }
    }

    next(new ForbiddenError('Cannot read org logo'));
  }),
];
