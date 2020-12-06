import { Request, Response } from 'express';
import { serializeUser } from '../../../auth/serialize-user';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { getUser } from '../../../auth/utils/get-user';

async function handler(req: Request, res: Response) {
  const user = getUser(req);
  res.json(user ? await serializeUser(user) : null);
}

export const getUserHandler = [
  wrapAsyncMiddleware(handler),
];
