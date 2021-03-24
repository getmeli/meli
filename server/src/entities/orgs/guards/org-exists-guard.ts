import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import {
  NextFunction, Request, Response,
} from 'express';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { $id } from '../../../utils/id';
import { Orgs } from '../org';

export const orgExistsGuard = [
  params(object({
    orgId: $id,
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { orgId } = req.params;
    Orgs()
      .countDocuments({
        _id: orgId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('Org not found'));
      })
      .catch(next);
  },
];
