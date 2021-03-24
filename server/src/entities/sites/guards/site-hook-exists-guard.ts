import { object } from 'joi';
import {
  NextFunction, Request, Response,
} from 'express';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { Sites } from '../site';

export const siteHookExistsGuard = [
  params(object({
    siteId: $id,
    hookId: $id,
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { siteId, hookId } = req.params;
    Sites()
      .countDocuments({
        _id: siteId,
        hooks: hookId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('Site hook not found'));
      })
      .catch(next);
  },
];
