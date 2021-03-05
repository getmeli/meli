import request from 'supertest';
import express, { Express } from 'express';
import { Server } from 'http';
import * as _isAdminOrOwner from './is-admin-or-owner';
import { isAdminOrOwnerGuard } from './is-admin-or-owner-guard';
import * as _getUser from '../utils/get-user';

describe('isAdminOrOwnerGuard', () => {

  let app: Express;
  let server: Server;

  beforeEach(async () => {
    app = express();
    app.use('/:orgId', isAdminOrOwnerGuard, (req, res) => {
      res.status(200).send();
    });
    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should be ok when user is admin or owner', async () => {
    const isAdminOrOwner = jest.spyOn(_isAdminOrOwner, 'isAdminOrOwner').mockReturnValue(Promise.resolve(true));
    jest.spyOn(_getUser, 'getUser').mockReturnValue(<any>{ _id: 'userId' });

    const response = await request(app)
      .get('/test')
      .send();

    expect(response.status).toEqual(200);
    expect(isAdminOrOwner).toHaveBeenCalledWith('userId', 'test');
  });

  it('should throw error when user is not admin or owner', async () => {
    jest.spyOn(_isAdminOrOwner, 'isAdminOrOwner').mockReturnValue(Promise.resolve(false));
    jest.spyOn(_getUser, 'getUser').mockReturnValue(<any>{ _id: 'userId' });

    const response = await request(app)
      .get('/test')
      .send();

    expect(response.status).toEqual(403);
  });

  it('should throw error when user is not authenticated', async () => {
    jest.spyOn(_getUser, 'getUser').mockReturnValue(undefined);

    const response = await request(app)
      .get('/test')
      .send();

    expect(response.status).toEqual(403);
  });

});
