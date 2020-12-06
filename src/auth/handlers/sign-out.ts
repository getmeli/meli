import { Request, Response } from 'express';
import { authCookieName, getCookieOptions } from '../auth';

export function handler(req: Request, res: Response) {
  res
    .cookie(authCookieName, '', getCookieOptions(0))
    .status(204)
    .send();
}

export const signOut = [
  handler,
];
