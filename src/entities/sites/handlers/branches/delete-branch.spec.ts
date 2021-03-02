import request from 'supertest';
import { testServer } from '../../../../../tests/test-server';
import { spyOnCollection } from '../../../../../tests/utils/spyon-collection';
import { spyOnVerifyToken } from '../../../../../tests/utils/spyon-verifytoken';
import * as _removeSiteBranchFromCaddy from '../../../../caddy/configuration';
import { removeSiteBranchFromCaddy } from '../../../../caddy/configuration';
import * as _emitEvent from '../../../../events/emit-event';
import { MeliServer } from '../../../../server';
import { EventType } from '../../../../events/event-type';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { promises } from 'fs';

jest.mock('../../guards/branch-exists-guard', () => ({
  branchExistsGuard: [
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
    jest.spyOn(_removeSiteBranchFromCaddy, 'removeSiteBranchFromCaddy').mockReturnValue(Promise.resolve());

    const response = await request(meliServer.app)
      .delete('/api/v1/sites/siteId/branches/branchId')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'test-branch',
      });

    expect(response.status).toEqual(204);
    expect(branchExistsGuard[0]).toHaveBeenCalled();
    expect(canAdminSiteGuard[0]).toHaveBeenCalled();
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

});
