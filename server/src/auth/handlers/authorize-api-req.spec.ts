import { Request, Response } from 'express';
import { Collection } from 'mongodb';
import { nextWaitGenerator } from '../../../tests/utils/next-wait';
import { spyOnCollection } from '../../../tests/utils/spyon-collection';
import { ApiToken } from '../../entities/api/api-token';
import { User } from '../../entities/users/user';
import { authorizeApiReq } from './authorize-api-req';


const authorizedApiReqHandler = authorizeApiReq[0];

describe('authorizeApiReq', () => {

  let req: Request;
  let res: Response;
  let apiToken: ApiToken;
  let user: User;

  let apiTokens;
  let users;

  beforeEach(() => {
    req = {
      query: {
        token: 'api-token',
      },
      header: jest.fn().mockReturnValue(undefined),
    } as Partial<Request> as Request;
    res = {} as Response;

    apiToken = {
      userId: 'authenticatedUserId',
    } as ApiToken;
    user = {
      _id: 'authenticatedUserId'
    } as User;

    apiTokens = spyOnCollection('ApiTokens', {
      findOne: jest.fn().mockImplementation(async () => apiToken),
    });
    users = spyOnCollection('Users', {
      findOne: jest.fn().mockImplementation(async () => user),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should set user in request and call next', async () => {
    const {next, wait} = nextWaitGenerator();
    authorizedApiReqHandler(req, res, next);
    const result = await wait;


    expect(result).toBeUndefined();
    expect(req.user).toBe(user);
    expect((req as any).apiToken).toBe(apiToken);
    expect(req.header).not.toHaveBeenCalledWith('x-token');
  });


  it('should fallback to header', async () => {
    req = {
      query: {},
      header: jest.fn().mockReturnValue('api-token'),
    } as Partial<Request> as Request;


    const {next, wait} = nextWaitGenerator();
    authorizedApiReqHandler(req, res, next);
    const result = await wait;


    expect(result).toBeUndefined();
    expect(req.user).toBe(user);
    expect((req as any).apiToken).toBe(apiToken);
    expect(req.header).toHaveBeenCalledWith('x-token');
  });


  it('should not set user if no token is set', async () => {
    req = {
      query: {},
      header: jest.fn().mockReturnValue(undefined),
    } as Partial<Request> as Request;


    const {next, wait} = nextWaitGenerator();
    authorizedApiReqHandler(req, res, next);
    const result = await wait;


    expect(result).toBeUndefined();
    expect(req.user).toBe(undefined);
    expect((req as any).apiToken).toBe(undefined);
    expect(req.header).toHaveBeenCalledWith('x-token');
  });


  it('should not set user if the token is not in database', async () => {
    apiToken = undefined;
    user = undefined;


    const {next, wait} = nextWaitGenerator();
    authorizedApiReqHandler(req, res, next);
    const result = await wait;


    expect(result).toBeUndefined();
    expect(req.user).toBe(undefined);
    expect((req as any).apiToken).toBe(undefined);
    expect(users.findOne).not.toHaveBeenCalled();
  });


  it('should not set user if the user is not in database', async () => {
    user = undefined;


    const {next, wait} = nextWaitGenerator();
    authorizedApiReqHandler(req, res, next);
    const result = await wait;


    expect(result).toBeUndefined();
    expect(req.user).toBe(undefined);
    expect((req as any).apiToken).toBe(undefined);
    expect(apiTokens.findOne).toHaveBeenCalled();
    expect(users.findOne).toHaveBeenCalled();
  });

});
