import { basicAuth } from './basic-auth';

describe('basicAuth', () => {
  it('should return basic auth header', async () => {
    expect(basicAuth('user', 'pass')).toEqual('Basic dXNlcjpwYXNz');
  });
});
