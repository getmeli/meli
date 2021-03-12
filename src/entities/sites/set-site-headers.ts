import { Request, Response } from 'express';
import { array, object } from 'joi';
import { updateSiteInCaddy } from '../../caddy/configuration';
import { ARRAY_MAX } from '../../constants';
import { $header } from './header';
import { emitEvent } from '../../events/emit-event';
import { EventType } from '../../events/event-type';
import { wrapAsyncMiddleware } from '../../commons/utils/wrap-async-middleware';
import { body } from '../../commons/express-joi/body';
import { canAdminSiteGuard } from './guards/can-admin-site-guard';
import { Sites } from './site';
import { Logger } from '../../commons/logger/logger';
import { serializeSite } from './serialize-site';
import { siteExistsGuard } from './guards/site-exists-guard';

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
  const { siteId } = req.params;

  await Sites().updateOne({
    _id: siteId,
  }, {
    $set: {
      headers: req.body.headers,
    },
  });

  const site = await Sites().findOne({
    _id: siteId,
  });

  updateSiteInCaddy(site).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_updated, {
    site,
  });

  res.json(serializeSite(site));
}

export const setSiteHeaders = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
