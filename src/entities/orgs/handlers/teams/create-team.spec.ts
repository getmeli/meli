import request from 'supertest';
import { testServer } from '../../../../../tests/test-server';
import { jsonDate } from '../../../../../tests/utils/matchers';
import { spyOnCollection } from '../../../../../tests/utils/spyon-collection';
import { spyOnIsAdminOrOwner } from '../../../../../tests/utils/spyon-isadminorowner';
import { AUTHENTICATED_USER_ID, spyOnVerifyToken } from '../../../../../tests/utils/spyon-verifytoken';
import * as _emitEvent from '../../../../events/emit-event';
import { MeliServer } from '../../../../server';

// jest.mock('../../../../env/env', () => ({ env: testEnv }));

describe('createTeam', () => {

  let meliServer: MeliServer;

  beforeEach(async () => {
    meliServer = await testServer();
    spyOnVerifyToken();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    meliServer.stop();
  });


  it('should create a team', async () => {
    const teams = spyOnCollection('Teams', {
      insertOne: jest.fn(),
    });
    const orgs = spyOnCollection('Orgs', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
      findOne: jest.fn().mockReturnValue(Promise.resolve({})),
    });
    const members = spyOnCollection('Members', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
    });
    jest.spyOn(_emitEvent, 'emitEvent').mockImplementation();


    const response = await request(meliServer.app)
      .post('/api/v1/orgs/organization-id/teams')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'Test Team',
      });


    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      color: expect.any(String),
      createdAt: jsonDate(),
      updatedAt: jsonDate(),
      name: 'Test Team',
    });
    expect(teams.insertOne).toHaveBeenCalledWith(expect.objectContaining({
      _id: expect.any(String),
      orgId: 'organization-id',
      color: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'Test Team',
      members: [],
      hooks: [],
    }));
  });


  it('should check that the organization exists', async () => {
    const orgs = spyOnCollection('Orgs', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(0)),
    });

    const response = await request(meliServer.app)
      .post('/api/v1/orgs/organization-id/teams')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'Test Team',
      });

    expect(response.status).toEqual(404);
    expect(orgs.countDocuments).toHaveBeenCalledWith({ _id: 'organization-id' }, expect.anything());
  });

  // TODO only check that guard has been called + unit test guard

  it('should check that the user is owner or admin', async () => {
    const orgs = spyOnCollection('Orgs', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
    });
    const isAdminOrOwner = spyOnIsAdminOrOwner(false);


    const response = await request(meliServer.app)
      .post('/api/v1/orgs/organization-id/teams')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'Test Team',
      });


    expect(response.status).toEqual(403);
    expect(isAdminOrOwner).toHaveBeenCalledWith(AUTHENTICATED_USER_ID, 'organization-id');
  });


  it('should validate the team', async () => {
    const orgs = spyOnCollection('Orgs', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
    });
    const members = spyOnCollection('Members', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
    });

    const response = await request(meliServer.app)
      .post('/api/v1/orgs/organization-id/teams')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: '',
      });

    expect(response.status).toEqual(400);
  });

});
