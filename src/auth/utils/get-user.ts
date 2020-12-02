import { Request } from 'express';
import { User } from '../../entities/users/user';

export function getUser(req: Request): User {
  return req.user as User;
}
