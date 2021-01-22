import * as _verifyToken from '../../src/auth/utils/verify-token';
import { User } from '../../src/entities/users/user';

export function spyOnVerifyToken(user: Partial<User> = {}) {
  return jest.spyOn(_verifyToken, 'verifyToken').mockReturnValue(Promise.resolve({
    _id: 'authenticatedUserId',
    name: 'Authenticated User',
    email: 'authenticated@test.tst',
    ...user,
  } as User));
}
