import { Request, Response } from 'express';
import { serializeSite } from '../serialize-site';
import { siteExistsGuard } from '../guards/site-exists-guard';
import { emitEvent } from '../../../events/emit-event';
import { EventType } from '../../../events/event-type';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { updateSiteInCaddy } from '../../../caddy/configuration';
import { params } from '../../../commons/express-joi/params';
import { canAdminSiteGuard } from '../guards/can-admin-site-guard';
import { object } from 'joi';
import { $id } from '../../../utils/id';
import { Sites } from '../site';
import { Logger } from '../../../commons/logger/logger';

const validators = [
  params(object({
    siteId: $id,
  })),
];

const logger = new Logger('meli.api:removeSitePassword');

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;

  await Sites().updateOne(
    {
      _id: siteId,
    },
    {
      $unset: {
        password: 1,
      },
    },
  );

  const site = await Sites().findOne({
    _id: siteId,
  });

  updateSiteInCaddy(site).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_password_removed, {
    site,
  });

  res.json(serializeSite(site));
}

export const removeSitePassword = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
