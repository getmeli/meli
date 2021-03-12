import request from 'supertest';
import { testServer } from '../../../../../tests/test-server';
import { spyOnCollection } from '../../../../../tests/utils/spyon-collection';
import { spyOnIsAdminOrOwner } from '../../../../../tests/utils/spyon-isadminorowner';
import { AUTHENTICATED_USER_ID, spyOnVerifyToken } from '../../../../../tests/utils/spyon-verifytoken';
import * as _addSiteToCaddy from '../../../../caddy/config/sites/add-site-to-caddy';
import * as _emitEvent from '../../../../events/emit-event';
import { MeliServer } from '../../../../server';

// jest.mock('../../../../env/env', () => ({ env: testEnv }));

describe('createSite', () => {

  let meliServer: MeliServer;

  beforeEach(async () => {
    meliServer = await testServer();
    spyOnVerifyToken();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    meliServer.stop();
  });


  it('should create a site', async () => {
    const teams = spyOnCollection('Teams', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
      findOne: jest.fn().mockReturnValue(Promise.resolve({orgId: 'organization-id'})),
    });
    const members = spyOnCollection('Members', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
    });
    const sites = spyOnCollection('Sites', {
      insertOne: jest.fn(),
    });
    const addSiteToCaddy = jest.spyOn(_addSiteToCaddy, 'addSiteToCaddy').mockReturnValue(Promise.resolve());
    jest.spyOn(_emitEvent, 'emitEvent').mockImplementation();


    const response = await request(meliServer.app)
      .post('/api/v1/teams/team-id/sites')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'test-site'
      });


    expect(response.status).toEqual(200);
    expect(sites.insertOne).toHaveBeenCalledWith(expect.objectContaining({
      _id: expect.any(String),
      teamId: 'team-id',
      color: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'test-site',
      domains: [],
      branches: [],
      tokens: [{
        _id: expect.any(String),
        name: 'first token',
        value: expect.any(String),
        createdAt: expect.any(Date),
      }],
      hooks: [],
    }));
    expect(addSiteToCaddy).toHaveBeenCalled();
  });


  it('should check if the team exists', async () => {
    const teams = spyOnCollection('Teams', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(0)),
    });


    const response = await request(meliServer.app)
      .post('/api/v1/teams/team-id/sites')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'test-site'
      });


    expect(response.status).toEqual(404);
    expect(teams.countDocuments).toHaveBeenCalledWith({_id: 'team-id'}, expect.anything());
  });


  it('should check if the user can administrate the team', async () => {
    const teams = spyOnCollection('Teams', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
      findOne: jest.fn().mockReturnValue(Promise.resolve({orgId: 'organization-id'})),
    });
    const isAdminOrOwner = spyOnIsAdminOrOwner(false);


    const response = await request(meliServer.app)
      .post('/api/v1/teams/team-id/sites')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'test-site'
      });


    expect(response.status).toEqual(403);
    expect(isAdminOrOwner).toHaveBeenCalledWith(AUTHENTICATED_USER_ID, 'organization-id');
  });


  it('should validate the site', async () => {
    const teams = spyOnCollection('Teams', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
      findOne: jest.fn().mockReturnValue(Promise.resolve({orgId: 'organization-id'})),
    });
    const isAdminOrOwner = spyOnIsAdminOrOwner(true);


    const response = await request(meliServer.app)
      .post('/api/v1/teams/team-id/sites')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'invalid site name'
      });

    expect(response.status).toEqual(400);
  });
});
