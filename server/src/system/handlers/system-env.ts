import { Request, Response } from 'express';
import { env } from '../../env/env';

export function systemEnv(req: Request, res: Response) {
  res.json({
    MELI_URL: env.MELI_URL,
  });
}
