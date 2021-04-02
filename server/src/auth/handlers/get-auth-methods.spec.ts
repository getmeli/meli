import request from 'supertest';
import { MeliServer } from '../../createServer';
import { spyOnVerifyToken } from '../../../tests/utils/spyon-verifytoken';
import { testServer } from '../../../tests/test-server';
import { authMethods } from '../passport/auth-methods';

jest.mock('../passport/auth-methods', () => ({
  authMethods: ['method'],
}));

describe('getAuthMethods', () => {

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
      .get('/auth/methods')
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(authMethods);
  });

});
