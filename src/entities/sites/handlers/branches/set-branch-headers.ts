import { Request, Response } from 'express';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { array, object } from 'joi';
import { ARRAY_MAX } from '../../../../constants';
import { emitEvent } from '../../../../events/emit-event';
import { EventType } from '../../../../events/event-type';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { body } from '../../../../commons/express-joi/body';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { Sites } from '../../site';
import { serializeBranch } from '../../serialize-branch';
import { configureSiteBranchInCaddy } from '../../../../caddy/configuration';
import { Logger } from '../../../../commons/logger/logger';
import { $header } from '../../header';

const validators = [
  body(object({
    headers: array().min(0).max(ARRAY_MAX).optional()
      .default([])
      .items($header)
      .unique((a, b) => a.name.toLowerCase() === b.name.toLowerCase()),
  })),
];

const logger = new Logger('meli.api:setBranchHeaders');

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId } = req.params;

  await Sites().updateOne({
    _id: siteId,
    'branches._id': branchId,
  }, {
    $set: {
      'branches.$.headers': req.body.headers,
    },
  });

  const site = await Sites().findOne({
    _id: siteId,
  });
  const branch = site.branches.find(brch => brch._id === branchId);

  configureSiteBranchInCaddy(site, branch).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_branch_updated, {
    site,
    branch,
  });

  res.json(serializeBranch(site, branch));
}

export const setBranchHeaders = [
  ...branchExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
