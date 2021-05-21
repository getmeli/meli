import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import {
  NextFunction, Request, Response,
} from 'express';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { $id } from '../../../utils/id';
import { Projects } from '../project';

export const projectExistsGuard = [
  params(object({
    projectId: $id,
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    Projects()
      .countDocuments({
        _id: projectId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('Project not found'));
      })
      .catch(next);
  },
];
