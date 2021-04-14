import { Request, Response } from 'express';
import { object } from 'joi';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Sites } from '../../site';
import { params } from '../../../../commons/express-joi/params';
import { emitEvent } from '../../../../events/emit-event';
import { getBranchDir } from '../../get-site-dir';
import { $id } from '../../../../utils/id';
import { promises } from 'fs';
import { EventType } from '../../../../events/event-type';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { removeSiteBranchFromCaddy } from '../../../../caddy/configuration';
import { Logger } from '../../../../commons/logger/logger';
import { canDeleteBranchGuard } from '../../guards/can-delete-branch-guard';

const validators = [
  params(object({
    siteId: $id,
    branchId: $id,
  })),
];

const logger = new Logger('meli.api:deleteBranch');

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
  });

  const branch = site.branches.find(brch => brch._id === branchId);

  // delete from storage
  const channelPath = getBranchDir(siteId, branch._id);
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

  removeSiteBranchFromCaddy(site, branch).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_branch_deleted, {
    site,
    branch,
  });

  res.status(204).send();
}

export const deleteBranch = [
  ...branchExistsGuard,
  ...canDeleteBranchGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
