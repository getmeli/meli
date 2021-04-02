import request from 'supertest';
import { MeliServer } from '../../createServer';
import { spyOnVerifyToken } from '../../../tests/utils/spyon-verifytoken';
import { testServer } from '../../../tests/test-server';

jest.mock('../passport/auth-methods', () => ({
  authMethods: ['method'],
}));

describe('signOut', () => {

  let meliServer: MeliServer;

  beforeEach(async () => {
    meliServer = await testServer();
    spyOnVerifyToken();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    meliServer.stop();
  });

  it('should delete the site', async () => {
    const response = await request(meliServer.app)
      .post('/auth/signout')
      .send();

    expect(response.status).toEqual(204);
    expect(response.headers['set-cookie'][0]).toMatch(/auth=; Max-Age=0; Path=\/; Expires=.*; HttpOnly/);
  });

});
