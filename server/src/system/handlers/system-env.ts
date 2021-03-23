import { Request, Response } from 'express';
import { env } from '../../env/env';

export function systemEnv(req: Request, res: Response) {
  res.json({
    GOOGLE_RECAPTCHA_SITE_KEY: env.MELI_GOOGLE_RECAPTCHA_SITE_KEY,
  });
}
