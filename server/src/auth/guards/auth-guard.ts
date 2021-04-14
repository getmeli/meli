import { NextFunction, Request, Response } from 'express';
import { getUser } from '../utils/get-user';
import { UnauthorizedError } from '../../commons/errors/unauthorized-error';

export function authGuard(req: Request, res: Response, next: NextFunction) {
  /*
   * TODO should support multiple auth methods sources:
   *  currently, authorizeReq + authorizeApiReq set a user => authGuard checks for the user
   *  apiGuard => checks for scopes
   *  we should have a authenticateSiteRequest => and a guard which checks
   */
  const user = getUser(req);
  if (user) {
    next(undefined);
  } else {
    next(new UnauthorizedError('You are not authenticated'));
  }
}
