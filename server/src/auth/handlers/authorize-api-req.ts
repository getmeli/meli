import {
  NextFunction, Request, Response,
} from 'express';
import { Logger } from '../../commons/logger/logger';
import { wrapAsyncMiddleware } from '../../commons/utils/wrap-async-middleware';
import { Users } from '../../entities/users/user';
import { ApiTokens } from '../../entities/api/api-token';

const logger = new Logger('meli.api:authorizeApiReq');

async function handler(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    logger.debug('req.user already defined, skipping api authorization');
    next();
    return;
  }

  const token = typeof req.query.token === 'string' ? req.query.token : req.header('x-token');

  if (!token) {
    logger.debug('no api token found in request');
    next();
    return;
  }

  logger.debug('api token', token);

  const now = new Date();
  const apiToken = await ApiTokens().findOne({
    value: token,
    $and: [
      {
        $or: [
          {
            activatesAt: null,
          },
          {
            activatesAt: {
              $lte: now,
            },
          },
        ],
      },
      {
        $or: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              $gte: now,
            },
          },
        ],
      },
    ],
  });

  if (apiToken) {
    logger.debug('api token found in db', apiToken);

    const user = await Users().findOne({
      _id: apiToken.userId,
    });
    if (user) {
      req.user = user;
      (req as any).apiToken = apiToken;
    }
  } else {
    logger.debug('api token matched nothing in db');
  }

  next();
}

export const authorizeApiReq = [
  wrapAsyncMiddleware(handler),
];
