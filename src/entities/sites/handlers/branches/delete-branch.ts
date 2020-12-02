import { Request, Response } from 'express';
import { object, string } from 'joi';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Sites } from '../../site';
import { params } from '../../../../commons/express-joi/params';
import { emitEvent } from '../../../../events/emit-event';
import { getBranchDir } from '../../get-site-dir';
import { $id } from '../../../../utils/id';
import { promises } from 'fs';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { EventType } from '../../../../events/app-event';
import { branchExistsGuard } from '../../guards/branch-exists-guard';

const validators = [
  params(object({
    siteId: $id,
    branchId: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
  });

  const branch = site.branches.find(brch => brch._id === branchId);

  // delete from storage
  const channelPath = getBranchDir(siteId, branch);
  try {
    await promises.rmdir(channelPath, {
      recursive: true,
    });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  // de-associate if site main
  await Sites().updateOne({
    _id: siteId,
    mainBranch: branchId,
  }, {
    $unset: {
      mainBranch: 1,
    },
  });

  // delete branch
  await Sites().updateOne({
    _id: siteId,
  }, {
    $pull: {
      branches: {
        _id: branchId,
      },
    },
  });

  emitEvent(EventType.site_branch_deleted, {
    site,
    branch,
  });

  res.status(204).send();
}

export const deleteBranch = [
  ...branchExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
