import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../../commons/errors/bad-request-error';
import axios from 'axios';
import { env } from '../../../env/env';
import { AppError } from '../../../commons/errors/app-error';
import { Logger } from '../../../commons/logger/logger';

const logger = new Logger('app.server:validateCaptcha');

export const validateCaptcha = env.MELI_GOOGLE_RECAPTCHA_SECRET_KEY ? (
  (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.headers;

    if (!token) {
      throw new BadRequestError('Missing captcha token');
    }

    // https://developers.google.com/recaptcha/docs/verify
    axios
      .post('https://www.google.com/recaptcha/api/siteverify', {}, {
        params: {
          secret: env.MELI_GOOGLE_RECAPTCHA_SECRET_KEY,
          response: token,
        },
      })
      .then(({ data }) => {
        if (data.success && data.score > 0.5) {
          delete req.body.token;
          return next();
        }

        if (data['error-codes']) {
          logger.debug('Could not verify recaptcha', data['error-codes']);
        }

        next(new AppError('Something went wrong'));
      })
      .catch(next);
  }
) : (
  (req, res, next) => {
    logger.warn('You are using forms without a recaptcha, this is greatly discouraged');
    next();
  }
);
