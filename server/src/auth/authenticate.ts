import { NextFunction, Request, Response } from 'express';
import { createOrUpdateUser, PassportUser } from './create-or-update-user';
import { env } from '../env/env';
import { authCookieName, getCookieOptions, JwtToken } from './auth';
import jwt from 'jsonwebtoken';
import { wrapAsyncMiddleware } from '../commons/utils/wrap-async-middleware';

async function handler(req: Request, res: Response, next: NextFunction) {
  const user = await createOrUpdateUser(req.user as PassportUser);

  const tokenPayload: JwtToken = {
    userId: user._id,
    issuedAt: Date.now(),
  };

  jwt.sign(tokenPayload, env.MELI_JWT_SECRET, (err, token) => {
    if (err) {
      return next(err);
    }

    res.cookie(authCookieName, token, getCookieOptions());

    next();
  });
}

export const authenticate = [
  wrapAsyncMiddleware(handler),
];
