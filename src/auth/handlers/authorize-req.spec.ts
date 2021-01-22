import exp from 'constants';
import { Request, Response } from 'express';
import { nextWaitGenerator } from '../../../tests/utils/next-wait';
import { User } from '../../entities/users/user';
import * as _verifyToken from '../utils/verify-token';
import { authorizeReq } from './authorize-req';
import objectContaining = jasmine.objectContaining;

const authorizedReqHandler = authorizeReq[0];

describe('authorizeReq', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should set user in request and call next', async () => {
    const req = {
      cookies: {
        auth: 'jwtToken',
      },
    } as Partial<Request> as Request;
    const res = {} as Partial<Response> as Response;
    const user = {_id: 'authenticatedUserId'} as Partial<User> as User;
    const verifyToken = jest.spyOn(_verifyToken, 'verifyToken').mockReturnValue(Promise.resolve(user));


    const {next, wait} = nextWaitGenerator();
    authorizedReqHandler(req, res, next);
    const result = await wait;


    expect(result).toBeUndefined();
    expect(req.user).toBe(user);
    expect(verifyToken).toHaveBeenCalledWith('jwtToken');
  });

  it('should not set user if no token is set', async () => {
    const req = {
      cookies: {},
    } as Partial<Request> as Request;
    const res = {} as Partial<Response> as Response;
    const verifyToken = jest.spyOn(_verifyToken, 'verifyToken').mockReturnValue(Promise.resolve(undefined));


    const {next, wait} = nextWaitGenerator();
    authorizedReqHandler(req, res, next);
    const result = await wait;


    expect(result).toBeUndefined();
    expect(req.user).toBeUndefined();
    expect(verifyToken).not.toHaveBeenCalled();
  });

  it('should throw if the token is invalid', async () => {
    const req = {
      cookies: {
        auth: 'jwtToken',
      },
    } as Partial<Request> as Request;
    const resCookie = jest.fn();
    const res = {
      cookie: resCookie,
    } as Partial<Response> as Response;
    const user = {_id: 'authenticatedUserId'} as Partial<User> as User;
    const verifyToken = jest.spyOn(_verifyToken, 'verifyToken')
      .mockReturnValue(Promise.reject(new Error('Provoked error')));


    const {next, wait} = nextWaitGenerator();
    authorizedReqHandler(req, res, next);


    await expect(wait).rejects.toThrowError('Provoked error');
    expect(resCookie).toHaveBeenCalledWith('auth', '', objectContaining({maxAge: 0}));
    expect(verifyToken).toHaveBeenCalledWith('jwtToken');
  });

});
