import { Request } from 'express';
import { query } from '../commons/express-joi/query';
import { stringToInt } from '../commons/env/transformers';
import { number } from 'joi';

export const pageValidators = [
  query({
    size: {
      transform: stringToInt(),
      $schema: number().optional().default(10).min(0)
        .max(100),
    },
    page: {
      transform: stringToInt(),
      $schema: number().optional().default(0).min(0),
    },
  }),
];

export function getPagination(req: Request): { size: number, offset: number } {
  const size: number = req.query.size ? req.query.size as any as number : 10;
  return {
    size,
    offset: req.query.page ? req.query.page as any as number * size : 0,
  };
}

export interface Page<T> {
  items: T[];
  count: number;
}

export function pageResponse<T>(items: any[], count: number): Page<T> {
  return {
    items,
    count,
  };
}
