import {
  NextFunction, Request, Response,
} from 'express';
import { authCookieName, cookieOptions } from '../auth';
import { Logger } from '../../commons/logger/logger';
import { verifyToken } from '../utils/verify-token';
import { wrapAsyncMiddleware } from '../../commons/utils/wrap-async-middleware';
import { User } from '../../entities/users/user';

const logger = new Logger('meli.api:authorizeReq');

async function handler(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[authCookieName];

  if (!token) {
    logger.debug('no token found in request');
    next();
    return;
  }

  logger.debug('found token in request', token);

  let user: User;
  try {
    user = await verifyToken(token);
  } catch (e) {
    // TODO better way to handle this ?
    res.cookie(authCookieName, '', cookieOptions(0));
    throw e;
  }

  logger.debug('setting req.user with', user);

  req.user = user;

  next();
}

export const authorizeReq = [
  wrapAsyncMiddleware(handler),
];
