import request from 'supertest';
import express, { Express } from 'express';
import { spyOnCollection } from '../../../../tests/utils/spyon-collection';
import { Server } from 'http';
import { canAdminApiTokenGuard } from './can-admin-api-token-guard';
import * as _getUser from '../../../auth/utils/get-user';

describe('canAdminApiTokenGuard', () => {

  let app: Express;
  let server: Server;

  beforeEach(async () => {
    app = express();
    app.use('/:apiTokenId', canAdminApiTokenGuard, (req, res) => {
      res.status(200).send();
    });
    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should be ok when api token exists', async () => {
    const ApiTokens = spyOnCollection('ApiTokens', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
    });
    jest.spyOn(_getUser, 'getUser').mockReturnValue(<any>{
      _id: 'userId',
    });

    const response = await request(app)
      .get('/id')
      .send();

    expect(response.status).toEqual(200);
    expect(ApiTokens.countDocuments).toHaveBeenCalledWith({
      _id: 'id',
      userId: 'userId',
    }, {
      limit: 1,
    });
  });

  it('should be forbidden when token not owned by user', async () => {
    spyOnCollection('ApiTokens', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(0)),
    });
    jest.spyOn(_getUser, 'getUser').mockReturnValue(<any>{
      _id: 'userId',
    });

    const response = await request(app)
      .get('/id')
      .send();

    expect(response.status).toEqual(403);
  });

  it('should throw error when request not authenticated', async () => {
    spyOnCollection('ApiTokens', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(0)),
    });
    jest.spyOn(_getUser, 'getUser').mockReturnValue(undefined);

    const response = await request(app)
      .get('/id')
      .send();

    expect(response.status).toEqual(500);
  });

});
