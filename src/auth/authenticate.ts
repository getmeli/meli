import {
  NextFunction, Request, Response,
} from 'express';
import { createOrUpdateUser, PassportUser } from './create-or-update-user';
import { env } from '../env';
import {
  authCookieName, cookieOptions, JwtToken,
} from './auth';
import jwt from 'jsonwebtoken';
import { Logger } from '../commons/logger/logger';
import { wrapAsyncMiddleware } from '../commons/utils/wrap-async-middleware';

const logger = new Logger('meli.api:authenticate');

async function handler(req: Request, res: Response, next: NextFunction) {
  const passportUser = req.user as PassportUser;

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
