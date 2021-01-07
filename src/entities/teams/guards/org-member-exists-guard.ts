import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { $id } from '../../../utils/id';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { Teams } from '../team';
import { Members } from '../../members/member';

export const orgMemberExistsGuard = [
  params(object({
    teamId: $id,
    memberId: $id,
  })),
  wrapAsyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { teamId, memberId } = req.params;

    const team = await Teams().findOne({ _id: teamId });

    if (!team) {
      return next(new NotFoundError('Team not found'));
    }

    const count = await Members().countDocuments({
      _id: memberId,
      orgId: team.orgId,
    }, {
      limit: 1,
    });

    next(count !== 0 ? undefined : new NotFoundError('Org member not found'));
  }),
];
