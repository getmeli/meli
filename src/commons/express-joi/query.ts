import { AnySchema, ValidationError } from 'joi';
import {
  NextFunction, Request, Response,
} from 'express';
import { JOI_OPTIONS } from '../../constants';
import { BadRequestError } from '../errors/bad-request-error';

interface SchemaData {
  transform?: (val: any) => any;
  $schema: AnySchema;
}

async function handleQueryParam(req: Request, key: string, { transform, $schema }: SchemaData) {
  let transformed: any;
  try {
    transformed = transform ? transform(req.query[key]) : req.query[key];
  } catch (e) {
    // harmonize error payload with params() and body()
    throw new BadRequestError(`Invalid query param ${key}`, <ValidationError>{
      message: `Invalid query param ${key}`,
      details: [{
        context: req.query,
        message: e.message,
        path: [],
        type: 'query.transform',
      }],
    });
  }
  req.query[key] = await $schema.validateAsync(transformed, JOI_OPTIONS);
}

/**
 * Validates express query params with Joi
 * @param schemas
 */
export function query(schemas: { [key: string]: SchemaData }) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise
      .all(
        Object
          .entries(schemas)
          .map(([key, data]) => (
            handleQueryParam(req, key, data)
          )),
      )
      .then(() => {
        next(undefined);
      })
      .catch(err => {
        next(new BadRequestError('Invalid params', err.details));
      });
  };
}
