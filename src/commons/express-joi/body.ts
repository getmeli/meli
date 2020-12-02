import { AnySchema } from 'joi';
import {
  NextFunction, Request, Response,
} from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { JOI_OPTIONS } from '../../constants';

export function body($schema: AnySchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    $schema
      .validateAsync(req.body, JOI_OPTIONS)
      .then(value => {
        req.body = value;
        next(undefined);
      })
      .catch(err => {
        next(new BadRequestError('Invalid body', err.details));
      });
  };
}
