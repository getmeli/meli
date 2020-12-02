import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { params } from '../../../../commons/express-joi/params';
import { object } from 'joi';
import { $id } from '../../../../utils/id';
import { Hooks } from '../../../../hooks/hook';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { siteHookExistsGuard } from '../../guards/site-hook-exists-guard';
import { serializeHook } from '../../../../hooks/serialize-hook';

const validators = [
  params(object({
    siteId: $id,
    hookId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { hookId } = req.params;

  const hook = await Hooks().findOne({
    _id: hookId,
  });

  res.json(serializeHook(hook));
}

export const getSiteHook = [
  ...siteHookExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
