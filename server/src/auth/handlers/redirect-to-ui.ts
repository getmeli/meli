import { Request, Response } from 'express';
import { env } from '../../env/env';
import { Logger } from '../../commons/logger/logger';

const logger = new Logger('meli.api:redirectToUi');

export function redirectToUi(req: Request, res: Response): void {
  logger.debug('Redirecting to', env.MELI_URL);
  res.redirect(env.MELI_URL);
}
