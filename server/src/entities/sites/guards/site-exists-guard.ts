import {
  NextFunction, Request, Response,
} from 'express';
import { object } from 'joi';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { params } from '../../../commons/express-joi/params';
import { Sites } from '../site';
import { $id } from '../../../utils/id';

export const siteExistsGuard = [
  params(object({
    siteId: $id,
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { siteId } = req.params;
    Sites()
      .countDocuments({
        _id: siteId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('Site not found'));
      })
      .catch(next);
  },
];
