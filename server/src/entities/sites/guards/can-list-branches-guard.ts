import { NextFunction, Request, Response } from 'express';
import { object, string } from 'joi';
import { ForbiddenError } from '../../../commons/errors/forbidden-error';
import { params } from '../../../commons/express-joi/params';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { siteExistsGuard } from './site-exists-guard';
import { canAdminSite } from './can-admin-site';
import { getUser } from '../../../auth/utils/get-user';
import { isSiteTokenValid } from './is-site-token-valid';

export const canListBranchesGuard = [
  params(object({
    siteId: string().required(),
  })),
  ...siteExistsGuard,
  wrapAsyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { siteId } = req.params;
    const user = getUser(req);

    // if user authenticated, check if they have access to the site
    if (user && await canAdminSite(siteId, user._id)) {
      return next();
    }

    // verify against a site token
    if (await isSiteTokenValid(siteId, req)) {
      return next();
    }

    next(new ForbiddenError('Cannot list branches'));
  }),
];
