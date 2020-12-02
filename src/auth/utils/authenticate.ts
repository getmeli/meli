import {
  NextFunction, Request, Response,
} from 'express';
import { createOrUpdateUser, PassportUser } from '../create-or-update-user';
import { env } from '../../env';
import { UnauthorizedError } from '../../commons/errors/unauthorized-error';
import {
  authCookieName, cookieOptions, JwtToken,
} from '../auth';
import jwt from 'jsonwebtoken';
import { Logger } from '../../commons/logger/logger';
import { wrapAsyncMiddleware } from '../../commons/utils/wrap-async-middleware';

const logger = new Logger('meli.server:authenticate');

const allowedOrgs = new Set(env.MELI_ORGS);

async function handler(req: Request, res: Response, next: NextFunction) {
  const passportUser = req.user as PassportUser;
  if (allowedOrgs.size !== 0 && passportUser.orgs && passportUser.orgs.every(org => !allowedOrgs.has(org))) {
    logger.debug('user', passportUser, 'not allowed to login as none of their orgs are allowed', env.MELI_ORGS);
    return next(new UnauthorizedError('Not an org member'));
  }

  const user = await createOrUpdateUser(passportUser);

  const tokenPayload: JwtToken = {
    userId: user._id,
    issuedAt: Date.now(),
  };

  jwt.sign(tokenPayload, env.MELI_JWT_SECRET, (err, token) => {
    if (err) {
      return next(err);
    }
    logger.debug(`Redirecting to ${env.MELI_UI_URL} with cookie ${authCookieName} ${JSON.stringify(cookieOptions(), null, 2)}`);
    res
      .cookie(authCookieName, token, cookieOptions())
      .redirect(env.MELI_UI_URL);
  });
}

export const authenticate = [
  wrapAsyncMiddleware(handler),
];
