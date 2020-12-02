import {
  NextFunction, Request, Response,
} from 'express';
import { object, string } from 'joi';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { params } from '../../../commons/express-joi/params';
import { Sites } from '../site';

export const branchExistsGuard = [
  params(object({
    branchId: string().required(),
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { branchId } = req.params;
    Sites()
      .countDocuments({
        'branches._id': branchId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('Branch not found'));
      })
      .catch(next);
  },
];
