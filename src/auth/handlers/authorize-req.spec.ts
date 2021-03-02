import { Express } from 'express';
import { User } from '../../entities/users/user';
import * as _verifyToken from '../utils/verify-token';
import { authorizeReq } from './authorize-req';
import { Server } from "http";
import supertest from 'supertest';
import cookieParser from 'cookie-parser';
import express = require('express');

describe('authorizeReq', () => {

  let app: Express;
  let server: Server;

  let reqUser = undefined;

  beforeEach(async () => {
    app = express();
    app.use(cookieParser());
    app.use(authorizeReq);
    app.use('/*', (req, res) => {
      reqUser = req.user;
      res.status(200).send();
    });
    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should set user in request and call next', async () => {
    const user = { _id: 'id' } as Partial<User> as User;
    const verifyToken = jest.spyOn(_verifyToken, 'verifyToken').mockReturnValue(Promise.resolve(user));

    const response = await supertest(app)
      .get('/')
      .set('Cookie', ['auth=token'])
      .send();

    expect(response.status).toEqual(200);
    expect(reqUser).toEqual(user);
    expect(verifyToken).toHaveBeenCalledWith('token');
  });

  it('should not set user if no token is set', async () => {
    const response = await supertest(app)
      .get('/')
      .send();

    expect(response.status).toEqual(200);
    expect(reqUser).toBeUndefined();
  });

  it('should throw if the token is invalid', async () => {
    const verifyToken = jest.spyOn(_verifyToken, 'verifyToken')
      .mockImplementation(() => {
        return Promise.reject(new Error('boom'));
      });

    const response = await supertest(app)
      .get('/')
      .set('Cookie', ['auth=token'])
      .send();

    expect(response.status).not.toEqual(200);
    expect(response.headers['set-cookie'][0]).toMatch(/auth=; Max-Age=0; Path=\/; Expires=.*; HttpOnly/);
    expect(reqUser).toBeUndefined();
  });

});
