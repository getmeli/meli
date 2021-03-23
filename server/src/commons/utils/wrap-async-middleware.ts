import {
  NextFunction, Request, Response,
} from 'express';

export function wrapAsyncMiddleware(
  fn: (req?: Request, res?: Response, next?: NextFunction) => void | Promise<void>,
): (req?: Request, res?: Response, next?: NextFunction) => void | Promise<any> {
  return async (req?: Request, res?: Response, next?: NextFunction) => {
    try {
      const result = fn(req, res, next);
      if (result) {
        (result as Promise<any>).catch(next);
      }
    } catch (e) {
      next(e);
    }
  };
}
