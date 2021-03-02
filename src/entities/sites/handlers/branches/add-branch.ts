import { Request, Response } from 'express';
import { siteExistsGuard } from '../../guards/site-exists-guard';
import { object, string } from 'joi';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Sites } from '../../site';
import { body } from '../../../../commons/express-joi/body';
import { emitEvent } from '../../../../events/emit-event';
import { serializeBranch } from '../../serialize-branch';
import { Releases } from '../../../releases/release';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { EventType } from '../../../../events/event-type';
import { $branchName, Branch } from '../../branch';
import { uuid } from '../../../../utils/uuid';
import { configureSiteBranchInCaddy } from '../../../../caddy/configuration';
import { Logger } from '../../../../commons/logger/logger';
import { slugify } from '../../../../utils/slugify';
import { linkBranchToRelease } from '../../link-branch-to-release';
import { NotFoundError } from '../../../../commons/errors/not-found-error';

const validators = [
  body(object({
    name: $branchName,
    releaseId: string().optional(),
  })),
];

const logger = new Logger('meli.api:addBranch');

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;
  const { releaseId } = req.body;

  // check release exists
  if (releaseId) {
    const count = await Releases().countDocuments({
      _id: releaseId,
      siteId,
    }, {
      limit: 1,
    });

    if (count === 0) {
      throw new NotFoundError('Release not found');
    }
  }

  const branch: Branch = {
    _id: uuid(),
    name: req.body.name,
    release: releaseId,
    slug: slugify(req.body.name),
  };

  await Sites().updateOne({
    _id: siteId,
  }, {
    $addToSet: {
      branches: branch,
    },
  });

  if (releaseId) {
    const release = await Releases().findOne({ _id: releaseId });
    await linkBranchToRelease(siteId, branch._id, release);

    await Releases().updateOne({
      _id: releaseId,
    }, {
      $addToSet: {
        branches: branch._id,
      },
    });
  }

  const site = await Sites().findOne({
    _id: siteId,
  });

  configureSiteBranchInCaddy(site, branch).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_branch_added, {
    site,
    branch,
  });

  res.json(serializeBranch(site, branch));
}

export const addBranch = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
