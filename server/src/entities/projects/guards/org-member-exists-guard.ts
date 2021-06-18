import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { $id } from '../../../utils/id';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { Projects } from '../project';
import { Members } from '../../members/member';

export const orgMemberExistsGuard = [
  params(object({
    projectId: $id,
    memberId: $id,
  })),
  wrapAsyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { projectId, memberId } = req.params;

    const project = await Projects().findOne({ _id: projectId });

    if (!project) {
      return next(new NotFoundError('Project not found'));
    }

    const count = await Members().countDocuments({
      _id: memberId,
      orgId: project.orgId,
    }, {
      limit: 1,
    });

    next(count !== 0 ? undefined : new NotFoundError('Organization member not found'));
  }),
];
