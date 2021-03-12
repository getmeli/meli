import request from 'supertest';
import { testServer } from '../../../../../tests/test-server';
import { spyOnCollection } from '../../../../../tests/utils/spyon-collection';
import { spyOnVerifyToken } from '../../../../../tests/utils/spyon-verifytoken';
import { addBranchToCaddy } from '../../../../caddy/config/sites/add-branch-to-caddy';
import * as _addBranchToCaddy from '../../../../caddy/config/sites/add-branch-to-caddy';
import * as _emitEvent from '../../../../events/emit-event';
import { MeliServer } from '../../../../server';
import * as _linkBranchToRelease from '../../link-branch-to-release';
import { linkBranchToRelease } from '../../link-branch-to-release';
import { EventType } from '../../../../events/event-type';
import { siteExistsGuard } from '../../guards/site-exists-guard';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';

jest.mock('../../guards/site-exists-guard', () => ({
  siteExistsGuard: [
    jest.fn().mockImplementation((req, res, next) => next()),
  ],
}));
jest.mock('../../guards/can-admin-site-guard', () => ({
  canAdminSiteGuard: [
    jest.fn().mockImplementation((req, res, next) => next()),
  ],
}));

describe('addBranch', () => {

  let meliServer: MeliServer;

  beforeEach(async () => {
    meliServer = await testServer();
    spyOnVerifyToken();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    meliServer.stop();
  });

  it('should add a branch to the site', async () => {
    const release = { orgId: 'organization-id' };
    const site = { _id: 'siteId' };
    const Sites = spyOnCollection('Sites', {
      updateOne: jest.fn(),
      findOne: jest.fn().mockReturnValue(Promise.resolve(site)),
    });
    const configureSiteBranchInCaddy = jest
      .spyOn(_addBranchToCaddy, 'addBranchToCaddy')
      .mockImplementation(() => Promise.resolve());
    const emitEvent = jest.spyOn(_emitEvent, 'emitEvent').mockImplementation();

    const response = await request(meliServer.app)
      .post('/api/v1/sites/siteId/branches')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'test-branch',
      });

    const branch = {
      _id: expect.any(String),
      name: 'test-branch',
      release: undefined,
      slug: 'test-branch',
    };
    expect(response.status).toEqual(200);
    expect(Sites.updateOne).toHaveBeenCalledWith(
      { _id: 'siteId' },
      {
        $addToSet: {
          branches: branch,
        },
      },
    );
    expect(configureSiteBranchInCaddy).toHaveBeenCalledWith(site, branch);
    expect(emitEvent).toHaveBeenCalledWith(EventType.site_branch_added, expect.objectContaining({ site, branch }));
    expect(siteExistsGuard[0]).toHaveBeenCalled();
    expect(canAdminSiteGuard[0]).toHaveBeenCalled();
  });

  it('should link release to created branch when releaseId is given', async () => {
    const release = { orgId: 'organization-id' };
    const Releases = spyOnCollection('Releases', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(1)),
      findOne: jest.fn().mockReturnValue(Promise.resolve(release)),
      updateOne: jest.fn(),
    });
    const site = { _id: 'siteId' };
    const Sites = spyOnCollection('Sites', {
      updateOne: jest.fn(),
      findOne: jest.fn().mockReturnValue(Promise.resolve(site)),
    });
    const linkBranchToRelease = jest.spyOn(_linkBranchToRelease, 'linkBranchToRelease').mockImplementation();
    jest
      .spyOn(_addBranchToCaddy, 'addBranchToCaddy')
      .mockImplementation(() => Promise.resolve());
    jest.spyOn(_emitEvent, 'emitEvent').mockImplementation();

    const response = await request(meliServer.app)
      .post('/api/v1/sites/siteId/branches')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'test-branch',
        releaseId: 'releaseId',
      });

    const branch = {
      _id: expect.any(String),
      name: 'test-branch',
      release: expect.any(String),
      slug: 'test-branch',
    };
    expect(response.status).toEqual(200);
    expect(Sites.updateOne).toHaveBeenCalledWith(
      { _id: 'siteId' },
      {
        $addToSet: {
          branches: branch,
        },
      },
    );
    expect(Releases.updateOne).toHaveBeenCalledWith(
      { _id: 'releaseId' },
      {
        $addToSet: {
          branches: expect.any(String),
        },
      },
    );
    expect(linkBranchToRelease).toHaveBeenCalledWith('siteId', expect.any(String), release);
  });

  it('should throw error when release does not exist', async () => {
    spyOnCollection('Releases', {
      countDocuments: jest.fn().mockReturnValue(Promise.resolve(0)),
    });

    const response = await request(meliServer.app)
      .post('/api/v1/sites/siteId/branches')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'test-branch',
        releaseId: 'releaseId',
      });

    expect(response.status).toEqual(404);
  });

  it('should throw error when use not authenticated', async () => {
    const response = await request(meliServer.app)
      .post('/api/v1/sites/siteId/branches')
      .send({
        name: 'test-branch',
      });

    expect(response.status).toEqual(401);
  });
});
