import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import {
  NextFunction, Request, Response,
} from 'express';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { $id } from '../../../utils/id';
import { Teams } from '../team';

export const teamExistsGuard = [
  params(object({
    teamId: $id,
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    Teams()
      .countDocuments({
        _id: teamId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('Team not found'));
      })
      .catch(next);
  },
];
