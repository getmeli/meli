import { User, Users } from '../entities/users/user';
import { Logger } from '../commons/logger/logger';
import { uuid } from '../utils/uuid';
import { Members } from '../entities/members/member';

const logger = new Logger('meli.server:createOrUpdateUser');

export interface PassportUser {
  authProvider: string;
  id: any;
  name: string;
  email: string;
}

export async function createOrUpdateUser(passportUser: PassportUser): Promise<User> {
  logger.debug('passportUser', passportUser);

  const { matchedCount } = await Users().updateOne({
    authProvider: passportUser.authProvider,
    externalUserId: passportUser.id,
  }, {
    $set: {
      updatedAt: new Date(),
      name: passportUser.name,
      email: passportUser.email,
    },
  });

  if (matchedCount === 0) {
    await Users().insertOne({
      _id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: passportUser.name,
      email: passportUser.email,
      authProvider: passportUser.authProvider,
      externalUserId: passportUser.id,
      hooks: [],
    });
  }

  const user = await Users().findOne({
    authProvider: passportUser.authProvider,
    externalUserId: passportUser.id,
  });

  // update all members
  await Members().updateMany({
    userId: user._id,
  }, {
    $set: {
      name: user.name,
      email: user.email,
    },
  });

  return user;
}
