import { Request, Response } from 'express';
import { siteExistsGuard } from '../../guards/site-exists-guard';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Sites } from '../../site';
import { serializeSiteToken } from '../../serialize-site-token';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';

const validators = [];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
  });

  res.json(site.tokens.map(serializeSiteToken));
}

export const listTokens = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
