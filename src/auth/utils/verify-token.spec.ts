import { promisify } from 'util';
import { spyOnCollection } from '../../../tests/utils/spyon-collection';
import { UnauthorizedError } from '../../commons/errors/unauthorized-error';
import jwt from 'jsonwebtoken';
import { User } from '../../entities/users/user';
import { verifyToken } from './verify-token';

const sign = promisify(jwt.sign);

describe('verifyToken', () => {

  it('it verifies the token with jwt', async () => {
    const invalidToken = await sign({
      userId: 'hackerId',
      issuedAt: new Date('2021-01-02T00:00:00.000Z').getTime(),
    }, 'wrongSecret');

    await expect(async () => await verifyToken(invalidToken)).rejects.toThrowError('Invalid token');
  });


  it('it checks the user in database', async () => {
    const token = await sign({
      userId: 'deletedUserId',
      issuedAt: new Date('2021-01-02T00:00:00.000Z').getTime(),
    }, process.env.MELI_JWT_SECRET);
    const users = spyOnCollection('Users', {
      findOne: jest.fn().mockReturnValue(Promise.resolve(undefined)),
    });


    await expect(async () => await verifyToken(token)).rejects.toThrowError('User not found');
    expect(users.findOne).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'deletedUserId',
    }));
  });


  it('it checks if the token is not invalidated', async () => {
    const token = await sign({
      userId: 'authenticatedUserId',
      issuedAt: new Date('2020-12-31T00:00:00.000Z').getTime(),
    }, process.env.MELI_JWT_SECRET);
    const users = spyOnCollection('Users', {
      findOne: jest.fn().mockReturnValue(Promise.resolve({
        invalidateTokensAt: new Date('2021-01-01T00:00:00.000Z').getTime(),
      } as Partial<User>)),
    });

    await expect(async () => await verifyToken(token)).rejects.toThrowError('Token was revoked');
    expect(users.findOne).toHaveBeenCalledWith({_id: 'authenticatedUserId'});
  });

});
