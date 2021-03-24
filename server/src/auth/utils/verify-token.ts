import { User, Users } from '../../entities/users/user';
import { env } from '../../env/env';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { UnauthorizedError } from '../../commons/errors/unauthorized-error';
import { Logger } from '../../commons/logger/logger';

const verify = promisify(jwt.verify);

const logger = new Logger('meli.api:verifyToken');

export async function verifyToken(token: string): Promise<User> {
  let userId: string;
  let issuedAt: number;
  try {
    ({ userId, issuedAt } = await verify(token, env.MELI_JWT_SECRET, {}));
  } catch (e) {
    logger.debug('Error trying to verify token', e);
    throw new UnauthorizedError('Invalid token');
  }

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
