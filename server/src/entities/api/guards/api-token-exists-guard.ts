import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { $id } from '../../../utils/id';
import { ApiTokens } from '../api-token';

export const apiTokenExistsGuard = [
  params(object({
    apiTokenId: $id,
  })),
  (req: Request, res: Response, next: NextFunction) => {
    const { apiTokenId } = req.params;
    ApiTokens()
      .countDocuments({
        _id: apiTokenId,
      }, {
        limit: 1,
      })
      .then(count => {
        next(count !== 0 ? undefined : new NotFoundError('Api token not found'));
      })
      .catch(next);
  },
];
