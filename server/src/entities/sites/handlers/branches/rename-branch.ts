import { Request, Response } from 'express';
import { Sites } from '../../site';
import { emitEvent } from '../../../../events/emit-event';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { body } from '../../../../commons/express-joi/body';
import { object, string } from 'joi';
import { serializeBranch } from '../../serialize-branch';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { EventType } from '../../../../events/event-type';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { params } from '../../../../commons/express-joi/params';
import { $id } from '../../../../utils/id';
import { $branchName } from '../../branch';
import { configureSiteInCaddy } from '../../../../caddy/configuration';
import { Logger } from '../../../../commons/logger/logger';

const validators = [
  params(object({
    siteId: $id,
    branchId: string().required(),
  })),
  body(object({
    name: $branchName,
  })),
];

const logger = new Logger('meli.api:removeBranch');

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId } = req.params;
  const newName = req.body.name;

  await Sites().updateOne(
    {
      _id: siteId,
      'branches._id': branchId,
    },
    {
      $set: {
        'branches.$.name': newName,
      },
    },
  );

  const site = await Sites().findOne({
    _id: siteId,
  });
  const branch = site.branches.find(brch => brch._id === branchId);

  configureSiteInCaddy(site).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_branch_updated, {
    site,
    branch,
  });

  res.json(serializeBranch(site, branch));
}

export const renameBranch = [
  ...branchExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
