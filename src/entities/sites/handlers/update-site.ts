import { Request, Response } from 'express';
import { $site, Sites } from '../site';
import { serializeSite } from '../serialize-site';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { body } from '../../../commons/express-joi/body';
import { siteExistsGuard } from '../guards/site-exists-guard';
import { emitEvent } from '../../../events/emit-event';
import { canAdminSiteGuard } from '../guards/can-admin-site-guard';
import { EventType } from '../../../events/event-type';
import { BadRequestError } from '../../../commons/errors/bad-request-error';
import { configureSiteInCaddy } from '../../../caddy/configuration';
import { Logger } from '../../../commons/logger/logger';

async function branchExists(siteId: string, branchId: string): Promise<boolean> {
  const count = await Sites().countDocuments({
    _id: siteId,
    'branches._id': branchId,
  }, {
    limit: 1,
  });
  return count === 1;
}

const validators = [
  body($site),
];

const logger = new Logger('meli.api:updateSite');

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;

  const siteBranchExists = await branchExists(siteId, req.body.mainBranch);
  if (!siteBranchExists) {
    throw new BadRequestError('Branch not found');
  }

  await Sites().updateOne(
    {
      _id: siteId,
    },
    {
      $set: {
        updatedAt: new Date(),
        name: req.body.name,
        color: req.body.color,
        mainBranch: req.body.mainBranch,
        notificationConfigs: req.body.notificationConfigs,
        domains: req.body.domains,
      },
    },
  );

  const site = await Sites().findOne({
    _id: siteId,
  });

  configureSiteInCaddy(site).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_updated, {
    site,
  });

  res.json(serializeSite(site));
}

export const updateSite = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
