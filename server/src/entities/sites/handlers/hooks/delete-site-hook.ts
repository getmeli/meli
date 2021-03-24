import { Request, Response } from 'express';
import { EventType } from '../../../../events/event-type';
import { emitEvent } from '../../../../events/emit-event';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { params } from '../../../../commons/express-joi/params';
import { object } from 'joi';
import { $id } from '../../../../utils/id';
import { Hooks } from '../../../../hooks/hook';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { Sites } from '../../site';
import { siteHookExistsGuard } from '../../guards/site-hook-exists-guard';
import { HookDeliveries } from '../../../../hooks/hook-delivery';

const validators = [
  params(object({
    siteId: $id,
    hookId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, hookId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
    hooks: hookId,
  });
  const hook = await Hooks().findOne({
    _id: hookId,
  });

  await Hooks().deleteOne({
    _id: hook._id,
  });
  await HookDeliveries().deleteMany({
    hookId: hook._id,
  });
  await Sites().updateOne({
    _id: site._id,
  }, {
    $pull: {
      hooks: hookId,
    },
  });

  emitEvent(EventType.site_hook_deleted, {
    site,
    hook,
  });

  res.status(204).send();
}

export const deleteSiteHook = [
  ...siteHookExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
