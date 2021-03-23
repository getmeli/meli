import { Request, Response } from 'express';
import { EventType } from '../../../../events/event-type';
import { emitEvent } from '../../../../events/emit-event';
import { $siteHhook } from './site-hook';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { params } from '../../../../commons/express-joi/params';
import { body } from '../../../../commons/express-joi/body';
import { object } from 'joi';
import { $id } from '../../../../utils/id';
import { Hooks } from '../../../../hooks/hook';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { serializeHook } from '../../../../hooks/serialize-hook';
import { Sites } from '../../site';
import { siteHookExistsGuard } from '../../guards/site-hook-exists-guard';

const validators = [
  params(object({
    siteId: $id,
    hookId: $id,
  })),
  body($siteHhook),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, hookId } = req.params;

  await Hooks().updateOne({
    _id: hookId,
  }, {
    $set: {
      updatedAt: new Date(),
      type: req.body.type,
      name: req.body.name,
      url: req.body.url,
      secret: req.body.secret,
      events: req.body.events,
      config: req.body.config,
    },
  });

  const site = await Sites().findOne({
    _id: siteId,
  });
  const hook = await Hooks().findOne({
    _id: hookId,
  });

  emitEvent(EventType.site_hook_updated, {
    site,
    hook,
  });

  res.json(serializeHook(hook));
}

export const updateSiteHook = [
  ...siteHookExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
