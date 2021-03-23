import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { object } from 'joi';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { getFilePath } from '../../../storage/get-file-path';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { Sites } from '../site';
import { siteExistsGuard } from '../guards/site-exists-guard';
import { canAdminSiteGuard } from '../guards/can-admin-site-guard';

const validators = [
  params(object({
    siteId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;

  const site = await Sites().findOne({ _id: siteId });

  if (!site.logo) {
    throw new NotFoundError('Site has no logo');
  }

  const filePath = getFilePath(site.logo.id);

  res.header('Content-Type', site.logo.type);
  res.download(filePath);
}

export const getSiteLogo = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
