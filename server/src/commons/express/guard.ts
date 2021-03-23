import {
  NextFunction, Request, Response,
} from 'express';
import { ForbiddenError } from '../errors/forbidden-error';

export function guard(
  check: (req: Request) => Promise<boolean>,
  message: string,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    check(req)
      .then(isAllowed => next(isAllowed ? undefined : new ForbiddenError(message)))
      .catch(next);
  };
}
