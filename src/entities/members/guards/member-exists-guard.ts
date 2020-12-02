import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import {
  NextFunction, Request, Response,
} from 'express';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { $id } from '../../../utils/id';
import { Members } from '../member';

export const memberExistsGuard = [
  params(object({
    memberId: $id,
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { memberId } = req.params;
    Members()
      .countDocuments({
        _id: memberId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('Org member not found'));
      })
      .catch(next);
  },
];
