import { Request, Response } from 'express';
import { object, string } from 'joi';
import { emitEvent } from '../../../events/emit-event';
import { EventType } from '../../../events/event-type';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { hashPassword } from '../hash-password';
import { updateSiteInCaddy } from '../../../caddy/configuration';
import { params } from '../../../commons/express-joi/params';
import { body } from '../../../commons/express-joi/body';
import { canAdminSiteGuard } from '../guards/can-admin-site-guard';
import { Sites } from '../site';
import { $id } from '../../../utils/id';
import { Logger } from '../../../commons/logger/logger';
import { serializeSite } from '../serialize-site';
import { siteExistsGuard } from '../guards/site-exists-guard';

const validators = [
  params(object({
    siteId: $id,
  })),
  body(object({
    password: string().required(),
  })),
];

const logger = new Logger('meli.api:setSitePassword');

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;
  const { password: plain } = req.body;

  const password = await hashPassword(plain);

  await Sites().updateOne(
    {
      _id: siteId,
    },
    {
      $set: {
        password,
      },
    },
  );

  const site = await Sites().findOne({
    _id: siteId,
  });

  updateSiteInCaddy(site).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_password_set, {
    site,
  });

  res.json(serializeSite(site));
}

export const setSitePassword = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
