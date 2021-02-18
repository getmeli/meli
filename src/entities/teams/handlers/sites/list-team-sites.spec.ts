import request from 'supertest';
import { testServer } from '../../../../../tests/test-server';
import { spyOnCollection } from '../../../../../tests/utils/spyon-collection';
import { spyOnVerifyToken } from '../../../../../tests/utils/spyon-verifytoken';
import { MeliServer } from '../../../../server';
import * as _teamExistsGuard from '../../guards/team-exists-guard';
import * as _canReadTeamGuard from '../../guards/can-read-team-guard';
import * as _serializeSite from '../../../sites/serialize-site';

jest.mock('../../guards/team-exists-guard', () => ({
  teamExistsGuard: [
    jest.fn().mockImplementation((req, res, next) => next()),
  ],
}));
jest.mock('../../guards/can-read-team-guard', () => ({
  canReadTeamGuard: [
    jest.fn().mockImplementation((req, res, next) => next()),
  ],
}));

describe('listTeamSites', () => {

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
    const serializeSite = jest.spyOn(_serializeSite, 'serializeSite').mockImplementation(val => val);

    const sort = jest.fn();
    const skip = jest.fn();
    const limit = jest.fn();
    const toArray = jest.fn();
    const sites = spyOnCollection('Sites', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(2)),
      find: jest.fn().mockReturnValue({
        sort: sort.mockReturnValue({
          skip: skip.mockReturnValue({
            limit: limit.mockReturnValue({
              toArray: toArray.mockReturnValue([{ id: 1 }, { id: 2 }]),
            }),
          }),
        }),
      }),
    });

    const response = await request(meliServer.app)
      .get('/api/v1/teams/team-id/sites')
      .set('Cookie', ['auth=testToken'])
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      items: [{ id: 1 }, { id: 2 }],
      count: 2,
    });
    expect(sites.countDocuments).toHaveBeenCalledWith({ teamId: 'team-id' });
    expect(sites.find).toHaveBeenCalledWith({ teamId: 'team-id' });
    expect(sort).toHaveBeenCalledWith({ updatedAt: -1 });
    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(10);
    expect(toArray).toHaveBeenCalled();
    expect(serializeSite.mock.calls.map(call => call.slice(0, 1))).toEqual([
      [{ id: 1 }],
      [{ id: 2 }],
    ]);
    expect(_teamExistsGuard.teamExistsGuard[0]).toHaveBeenCalled();
    expect(_canReadTeamGuard.canReadTeamGuard[0]).toHaveBeenCalled();
  });

});
