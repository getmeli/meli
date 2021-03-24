import { getUser } from './get-user';

describe('getUser', () => {

  afterEach(() => jest.restoreAllMocks());

  it('should get user from socket', async () => {
    const fakeUser: any = { _id: 'userId' };

    const user = getUser(<any>{
      user: fakeUser,
    });

    expect(user).toEqual(fakeUser);
  });

});
