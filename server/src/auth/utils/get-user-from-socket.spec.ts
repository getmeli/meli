import { getUserFromSocket } from './get-user-from-socket';
import * as _verifyToken from './verify-token';

describe('getUserFromSocket', () => {

  afterEach(() => jest.restoreAllMocks());

  it('should get user from socket', async () => {
    const fakeUser: any = { _id: 'userId' };
    const verifyToken = jest.spyOn(_verifyToken, 'verifyToken').mockReturnValue(fakeUser);

    const user = await getUserFromSocket(<any>{
      handshake: {
        headers: {
          cookie: 'auth=token',
        },
      },
    });

    expect(user).toEqual(fakeUser);
    expect(verifyToken).toHaveBeenCalledWith('token');
  });

});
