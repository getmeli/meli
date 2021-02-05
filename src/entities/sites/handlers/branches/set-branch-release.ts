import { Request, Response } from 'express';
import { Sites } from '../../site';
import { emitEvent } from '../../../../events/emit-event';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { body } from '../../../../commons/express-joi/body';
import { object, string } from 'joi';
import { Releases } from '../../../releases/release';
import { AppError } from '../../../../commons/errors/app-error';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { $id } from '../../../../utils/id';
import { EventType } from '../../../../events/event-type';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { params } from '../../../../commons/express-joi/params';
import { serializeBranch } from '../../serialize-branch';
import { linkBranchToRelease } from '../../link-branch-to-release';
import { updateBranchInCaddy } from '../../../../caddy/configuration';
import { Logger } from '../../../../commons/logger/logger';

const validators = [
  params(object({
    siteId: $id,
    branchId: string().required(),
  })),
  body(object({
    release: $id,
  })),
];

const logger = new Logger('meli.api:setBranchRelease');

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId } = req.params;
  const { release: releaseId } = req.body;

  const count = await Releases().countDocuments({
    _id: releaseId,
    siteId,
  }, {
    limit: 1,
  });

  if (count === 0) {
    throw new AppError('Release not found');
  }

  await Sites().updateOne(
    {
      _id: siteId,
      'branches._id': branchId,
    },
    {
      $set: {
        'branches.$.release': releaseId,
      },
    },
  );

  const site = await Sites().findOne({
    _id: siteId,
  });
  const branch = site.branches.find(brch => brch._id === branchId);
  const release = await Releases().findOne({
    _id: releaseId,
  });

  await linkBranchToRelease(site._id, branch._id, release);

  updateBranchInCaddy(site, branch).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_branch_release_set, {
    site,
    branch,
    release,
  });

  res.json(serializeBranch(site, branch));
}

export const setBranchRelease = [
  ...branchExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
