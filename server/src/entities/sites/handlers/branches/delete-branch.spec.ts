import request from 'supertest';
import { testServer } from '../../../../../tests/test-server';
import { spyOnCollection } from '../../../../../tests/utils/spyon-collection';
import { spyOnVerifyToken } from '../../../../../tests/utils/spyon-verifytoken';
import * as _removeSiteBranchFromCaddy from '../../../../caddy/configuration';
import { removeSiteBranchFromCaddy } from '../../../../caddy/configuration';
import * as _emitEvent from '../../../../events/emit-event';
import { MeliServer } from '../../../../createServer';
import { EventType } from '../../../../events/event-type';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { promises } from 'fs';
import { Site } from '../../site';
import { canDeleteBranchGuard } from '../../guards/can-delete-branch-guard';

jest.mock('../../guards/branch-exists-guard', () => ({
  branchExistsGuard: [
    jest.fn().mockImplementation((req, res, next) => next()),
  ],
}));
jest.mock('../../guards/can-delete-branch-guard', () => ({
  canDeleteBranchGuard: [
    jest.fn().mockImplementation((req, res, next) => next()),
  ],
}));

describe('addBranch', () => {

  let meliServer: MeliServer;

  let removeSiteBranchFromCaddy: jest.SpyInstance;
  let emitEvent: jest.SpyInstance;

  beforeEach(async () => {
    meliServer = await testServer();
    spyOnVerifyToken();

    removeSiteBranchFromCaddy = jest.spyOn(_removeSiteBranchFromCaddy, 'removeSiteBranchFromCaddy').mockReturnValue(Promise.resolve());
    emitEvent = jest.spyOn(_emitEvent, 'emitEvent').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    meliServer.stop();
  });

  it('should delete the site', async () => {
    const branch = { _id: 'branchId' };
    const site = {
      _id: 'siteId',
      branches: [branch],
    };
    const rmdir = jest.spyOn(promises, 'rmdir');
    const Sites = spyOnCollection('Sites', {
      findOne: jest.fn().mockReturnValue(Promise.resolve(site)),
      updateOne: jest.fn(),
    });
    const emitEvent = jest.spyOn(_emitEvent, 'emitEvent').mockImplementation();

    const response = await request(meliServer.app)
      .delete('/api/v1/sites/siteId/branches/branchId')
      .set('Cookie', ['auth=testToken'])
      .send();

    expect(response.status).toEqual(204);
    expect(branchExistsGuard[0]).toHaveBeenCalled();
    expect(canDeleteBranchGuard[0]).toHaveBeenCalled();
    expect(rmdir).toHaveBeenCalledWith('/sites/siteId/branches/branchId', { "recursive": true });
    expect((Sites.updateOne as any).mock.calls).toEqual([
      [{
        _id: 'siteId',
        mainBranch: 'branchId',
      }, {
        $unset: {
          mainBranch: 1,
        },
      }],
      [{
        _id: 'siteId',
      }, {
        $pull: {
          branches: {
            _id: 'branchId',
          },
        },
      }],
    ]);
    expect(removeSiteBranchFromCaddy).toHaveBeenCalledWith(site, branch);
    expect(emitEvent).toHaveBeenCalledWith(EventType.site_branch_deleted, expect.objectContaining({ site, branch }));
  });

  it('should allow deleting a branch with a site token', async () => {
    const site: Partial<Site> = {
      _id: 'siteId',
      branches: [{ _id: 'branchId' } as any],
      tokens: [{ value: 'token' } as any],
    };
    spyOnCollection('Sites', {
      findOne: jest.fn().mockReturnValue(Promise.resolve(site)),
      updateOne: jest.fn(),
      countDocuments: jest.fn(),
    });

    const response = await request(meliServer.app)
      .delete('/api/v1/sites/siteId/branches/branchId')
      .set('x-meli-token', 'token')
      .send();

    expect(response.status).toEqual(204);
    expect(emitEvent).toHaveBeenCalled();
  });

});
