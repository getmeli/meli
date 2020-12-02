import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { params } from '../../../../commons/express-joi/params';
import { Request, Response } from 'express';
import { object } from 'joi';
import { $id } from '../../../../utils/id';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { serializeHook } from '../../../../hooks/serialize-hook';
import { Hooks } from '../../../../hooks/hook';
import { Sites } from '../../site';
import { siteExistsGuard } from '../../guards/site-exists-guard';

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

  const hooks = await Hooks()
    .find({
      _id: {
        $in: site.hooks || [],
      },
    })
    .toArray();

  res.json(hooks.map(serializeHook) || []);
}

export const listSiteHooks = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
