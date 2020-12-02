import { Request, Response } from 'express';
import { authCookieName, cookieOptions } from '../auth';

export function handler(req: Request, res: Response) {
  res
    .cookie(authCookieName, '', cookieOptions(0))
    .status(204)
    .send();
}

export const signOut = [
  handler,
];
