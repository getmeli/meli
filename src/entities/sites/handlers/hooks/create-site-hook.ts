import { Request, Response } from 'express';
import { emitEvent } from '../../../../events/emit-event';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { params } from '../../../../commons/express-joi/params';
import { body } from '../../../../commons/express-joi/body';
import { uuid } from '../../../../utils/uuid';
import { EventType } from '../../../../events/app-event';
import { Hook, Hooks } from '../../../../hooks/hook';
import { object } from 'joi';
import { $id } from '../../../../utils/id';
import { $siteHhook } from './site-hook';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { serializeHook } from '../../../../hooks/serialize-hook';
import { Sites } from '../../site';
import { siteExistsGuard } from '../../guards/site-exists-guard';

const validators = [
  params(object({
    siteId: $id,
  })),
  body($siteHhook),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;

  const hook: Hook = {
    _id: uuid(),
    name: req.body.name,
    type: req.body.type,
    config: req.body.config,
    events: req.body.events,
    createdAt: new Date(),
  };

  await Hooks().insertOne(hook);
  await Sites().updateOne({
    _id: siteId,
  }, {
    $push: {
      hooks: hook._id,
    },
  });

  const site = await Sites().findOne({
    _id: siteId,
  });

  emitEvent(EventType.site_hook_created, {
    site,
    hook,
  });

  res.json(serializeHook(hook));
}

export const createSiteHook = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
