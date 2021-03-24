import { NextFunction, Request, Response } from 'express';
import { ApiScope } from '../../entities/api/api-scope';
import { ForbiddenError } from '../../commons/errors/forbidden-error';

export function apiGuard(...scopes: ApiScope[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { apiToken } = req as any;
    if (apiToken && !scopes.some(scope => apiToken.scopes.includes(scope))) {
      next(new ForbiddenError(`Api token is missing one of scopes [${scopes.join(',')}]`));
    } else {
      next();
    }
  };
}
