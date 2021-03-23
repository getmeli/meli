import {
  NextFunction, Request, Response,
} from 'express';
import { object } from 'joi';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { params } from '../../../commons/express-joi/params';
import { Users } from '../user';
import { $id } from '../../../utils/id';

export const userExistsGuard = [
  params(object({
    userId: $id,
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    Users()
      .countDocuments({
        _id: userId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('User not found'));
      })
      .catch(next);
  },
];
