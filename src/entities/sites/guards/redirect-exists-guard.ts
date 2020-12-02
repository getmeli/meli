import {
  NextFunction, Request, Response,
} from 'express';
import { object } from 'joi';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { Sites } from '../site';

export const redirectExistsGuard = [
  params(object({
    redirectId: $id,
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { redirectId } = req.params;
    Sites()
      .countDocuments({
        'branches.redirects._id': redirectId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('Redirect not found'));
      })
      .catch(next);
  },
];
