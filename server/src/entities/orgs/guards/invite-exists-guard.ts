import { params } from '../../../commons/express-joi/params';
import { object, string } from 'joi';
import {
  NextFunction, Request, Response,
} from 'express';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { $id } from '../../../utils/id';
import { Orgs } from '../org';

export const inviteExistsGuard = [
  params(object({
    orgId: $id,
    inviteId: string().required(),
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { orgId, inviteId } = req.params;
    Orgs()
      .countDocuments({
        _id: orgId,
        'invites._id': inviteId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('Org member not found'));
      })
      .catch(next);
  },
];
