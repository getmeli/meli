import request from 'supertest';
import express, { Express } from 'express';
import { Server } from 'http';
import { authGuard } from './auth-guard';
import * as _getUser from '../utils/get-user';

const fakeAuth = (req, res, next) => {
  if (req.header('Authorization')) {
    req.user = {
      id: 'userId',
    };
  }
  next();
};

describe('authGuard', () => {

  let app: Express;
  let server: Server;

  beforeEach(async () => {
    app = express();
    app.use(fakeAuth);
    app.use('*', authGuard, (req, res) => {
      res.status(200).send();
    });
    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should be ok when user authenticated', async () => {
    const getUser = jest.spyOn(_getUser, 'getUser').mockReturnValue({} as any);

    const response = await request(app)
      .get('/')
      .set('Authorization', 'token')
      .send();

    expect(response.status).toEqual(200);
    expect(getUser).toHaveBeenCalled();
  });

  it('should throw error when user is not authenticated', async () => {
    jest.spyOn(_getUser, 'getUser').mockReturnValue(undefined);

    const response = await request(app)
      .get('/id')
      .send();

    expect(response.status).toEqual(401);
  });

});
