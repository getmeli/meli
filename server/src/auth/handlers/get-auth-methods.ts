import { Request, Response } from 'express';
import { authMethods } from '../passport/auth-methods';

export function handler(req: Request, res: Response) {
  res.json(authMethods);
}

export const getAuthMethods = [
  handler,
];
