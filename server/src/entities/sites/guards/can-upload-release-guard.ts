import {
  NextFunction, Request, Response,
} from 'express';
import { object, string } from 'joi';
import { ForbiddenError } from '../../../commons/errors/forbidden-error';
import { UnauthorizedError } from '../../../commons/errors/unauthorized-error';
import { params } from '../../../commons/express-joi/params';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { Sites } from '../site';
import { siteExistsGuard } from './site-exists-guard';

export const canUploadReleaseGuard = [
  params(object({
    siteId: string().required(),
  })),
  ...siteExistsGuard,
  wrapAsyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { siteId } = req.params;
    // TODO should we use req.header('X-Meli-Token') ?
    const token = req.headers['x-meli-token'];

    if (!token) {
      next(new ForbiddenError('Missing token'));
      return;
    }

    const site = await Sites().findOne({
      _id: siteId,
    });
    if (!site.tokens.some(t => t.value === token)) {
      next(new UnauthorizedError('Invalid token'));
      return;
    }
    next();
  }),
];
