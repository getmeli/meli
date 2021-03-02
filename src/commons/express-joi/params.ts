import { AnySchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { JOI_OPTIONS } from '../../constants';
import { BadRequestError } from '../errors/bad-request-error';

export function params($schema: AnySchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    $schema
      .validateAsync(req.params, JOI_OPTIONS)
      .then(() => next(undefined))
      .catch(err => {
        next(new BadRequestError('Invalid params', err.details));
      });
  };
}
