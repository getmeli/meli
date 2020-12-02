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
import { EventType } from '../../../events/app-event';

const validators = [
  params(object({
    siteId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
  });

  await Sites().deleteOne({
    _id: siteId,
  });

  await removeSiteFromCaddy(siteId);

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
