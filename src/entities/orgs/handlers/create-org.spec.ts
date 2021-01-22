import { testServer } from '../../../../tests/test-server';
import { spyOnCollection } from '../../../../tests/utils/spyon-collection';
import { spyOnVerifyToken } from '../../../../tests/utils/spyon-verifytoken';
import * as _emitEvent from '../../../events/emit-event';
import { MeliServer } from '../../../server';
import { User } from '../../users/user';

import request from 'supertest';

// jest.mock('../../../env/env', () => ({ env: testEnv }));

describe('createOrg', () => {

  let meliServer: MeliServer;

  beforeEach(async () => {
    meliServer = await testServer();
    spyOnVerifyToken();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    meliServer.stop();
    (process.env as any).MELI_MAX_ORGS = 0;
  });


  it('should create an organization', async () => {
    const orgs = spyOnCollection('Orgs', {
      insertOne: jest.fn(),
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(0)),
    });
    const members = spyOnCollection('Members', {
      insertOne: jest.fn(),
    });
    const teams = spyOnCollection('Teams', {
      insertOne: jest.fn(),
    });
    const users = spyOnCollection('Users', {
      findOne: async () => ({
        _id: 'authenticatedUserId',
        name: 'Tester',
        email: 'tester@test.tst',
      } as User),
    });
    jest.spyOn(_emitEvent, 'emitEvent').mockImplementation();


    const response = await request(meliServer.app)
      .post('/api/v1/orgs')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'Test Organization'
      });


    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      member: {
        admin: true,
        owner: true,
      },
      org: {
        name: 'Test Organization',
      },
    });

    expect(orgs.countDocuments).toHaveBeenCalled();
    expect(orgs.insertOne).toHaveBeenCalledWith(expect.objectContaining({
      ownerId: 'authenticatedUserId',
      name: 'Test Organization',
    }));

    expect(members.insertOne).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'authenticatedUserId',
      admin: true,
      name: 'Authenticated User',
      email: 'authenticated@test.tst'
    }));

    expect(teams.insertOne).toHaveBeenCalled();
  });

  it('should not create an organization if the cap has been reached', async () => {
    //testEnv.MELI_MAX_ORGS = 1;
    (process.env as any).MELI_MAX_ORGS = 1;

    const orgs = spyOnCollection('Orgs', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
    })

    const response = await request(meliServer.app)
      .post('/api/v1/orgs')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'Test Organization'
      });


    expect(response.status).toEqual(403);

    expect(orgs.countDocuments).toHaveBeenCalled();
  });

  it('should validate the organization', async () => {
    const orgs = spyOnCollection('Orgs', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(0)),
    })


    const response = await request(meliServer.app)
      .post('/api/v1/orgs')
      .set('Cookie', ['auth=testToken'])
      .send({});


    expect(response.status).toEqual(400);
  });

});
