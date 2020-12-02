import { Request, Response } from 'express';
import { siteExistsGuard } from '../../guards/site-exists-guard';
import { object, string } from 'joi';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Sites } from '../../site';
import { body } from '../../../../commons/express-joi/body';
import { emitEvent } from '../../../../events/emit-event';
import { serializeBranch } from '../../serialize-branch';
import { Releases } from '../../../releases/release';
import { AppError } from '../../../../commons/errors/app-error';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { EventType } from '../../../../events/app-event';
import { $channelName, Branch } from '../../branch';
import { uuid } from '../../../../utils/uuid';
import slugify from 'slugify';

const validators = [
  body(object({
    name: $channelName,
    releaseId: string().optional(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;

  const { releaseId } = req.body;

  if (releaseId) {
    const count = await Releases().countDocuments({
      _id: releaseId,
      siteId,
    }, {
      limit: 1,
    });

    if (count === 0) {
      throw new AppError('Release not found');
    }
  }

  const branch: Branch = {
    _id: uuid(),
    name: req.body.name,
    release: releaseId,
    slug: slugify(req.body.name),
  };

  const { matchedCount } = await Sites().updateOne({
    _id: siteId,
  }, {
    $addToSet: {
      branches: branch,
    },
  });

  if (matchedCount === 0) {
    throw new Error('Branch already exists');
  }

  await Releases().updateOne({
    _id: releaseId,
  }, {
    $addToSet: {
      branches: branch._id,
    },
  });

  const site = await Sites().findOne({
    _id: siteId,
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
