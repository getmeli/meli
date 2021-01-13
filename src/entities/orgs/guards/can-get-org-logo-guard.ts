import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { $id } from '../../../utils/id';
import { Orgs } from '../org';
import { getUser } from '../../../auth/utils/get-user';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { ForbiddenError } from '../../../commons/errors/forbidden-error';
import { isOrgMember } from './is-org-member';

export const canGetOrgLogoGuard = [
  params(object({
    orgId: $id,
  })),
  wrapAsyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { orgId } = req.params;

    // check user belongs to org
    const user = getUser(req);
    const orgMember = await isOrgMember(user._id, orgId);
    if (orgMember) {
      return next();
    }

    // check user has an invite token
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
