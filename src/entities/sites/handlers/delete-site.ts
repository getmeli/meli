import { Request, Response } from 'express';
import { object } from 'joi';
import { removeSiteFromCaddy } from '../../../caddy/configuration';
import { params } from '../../../commons/express-joi/params';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { Sites } from '../site';
import { siteExistsGuard } from '../guards/site-exists-guard';
import { emitEvent } from '../../../events/emit-event';
import { canAdminSiteGuard } from '../guards/can-admin-site-guard';
import { $id } from '../../../utils/id';
import { EventType } from '../../../events/event-type';
import { Logger } from '../../../commons/logger/logger';

const validators = [
  params(object({
    siteId: $id,
  })),
];

const logger = new Logger('meli.api:deleteSite');

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
  });

  await Sites().deleteOne({
    _id: siteId,
  });

  removeSiteFromCaddy(siteId).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_deleted, {
    site,
  });

  res.status(204).send();
}

export const deleteSite = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
