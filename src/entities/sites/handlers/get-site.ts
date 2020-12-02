import { Request, Response } from 'express';
import { serializeSite } from '../serialize-site';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { Sites } from '../site';
import { siteExistsGuard } from '../guards/site-exists-guard';
import { $id } from '../../../utils/id';
import { canAdminSiteGuard } from '../guards/can-admin-site-guard';

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
  res.json(serializeSite(site));
}

export const getSite = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
