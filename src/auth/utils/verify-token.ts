import { User, Users } from '../../entities/users/user';
import { env } from '../../env';
import { JwtToken } from '../auth';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { UnauthorizedError } from '../../commons/errors/unauthorized-error';

const verify = promisify(jwt.verify);

export async function verifyToken(token: string): Promise<User> {
  const { userId, issuedAt }: JwtToken = await verify(token, env.MELI_JWT_SECRET, {});

  const user = await Users().findOne({
    _id: userId,
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  if (user.invalidateTokensAt && user.invalidateTokensAt > issuedAt) {
    throw new UnauthorizedError('Token was revoked');
  }

  return user;
}
