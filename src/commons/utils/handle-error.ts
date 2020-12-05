import {
  NextFunction, Request, Response,
} from 'express';
import { AxiosError } from 'axios';
import { Logger } from '../logger/logger';
import { HttpError } from '../errors/http-error';
import { ValidationError } from 'joi';
import { AppError } from '../errors/app-error';

const logger = new Logger('meli.server:handleError');

export function handleError(err: any, req: Request, res: Response, next: NextFunction): void {
  logger.debug(err);

  if (res.headersSent) {
    logger.debug('Headers sent, calling next(err)');
    return next(err);
  }

  // TODO refactor
  if (!(err instanceof HttpError)) {
    if (err.isAxiosError) {
      logger.debug(JSON.stringify(err.toJSON(), null, 2));
      const axiosError: AxiosError = err as AxiosError;
      logger.debug('response', JSON.stringify(axiosError.response?.data, null, 2));
    }
  }

  const status = err instanceof ValidationError ? 400 : err?.statusCode || 500;
  const error = err instanceof ValidationError ? err.details : err?.jsonResponse;
  const message = err instanceof AppError || err instanceof HttpError ? err.message : 'Internal error';

  const errorBody = {
    statusCode: status,
    path: req.path,
    message,
    error,
  };

  logger.debug(errorBody);

  res
    .status(status)
    .send(errorBody);
}
