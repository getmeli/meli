import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { object } from 'joi';
import { EventType } from '../../../events/event-type';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { Sites } from '../site';
import { serializeSite } from '../serialize-site';
import { siteExistsGuard } from '../guards/site-exists-guard';
import { canAdminSiteGuard } from '../guards/can-admin-site-guard';
import { deleteFile } from '../../../storage/delete-file';
import { BadRequestError } from '../../../commons/errors/bad-request-error';

const validators = [
  params(object({
    siteId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;

  const { logo } = await Sites().findOne({
    _id: siteId,
  });

  if (!logo) {
    throw new BadRequestError('Site has no logo');
  }

  await deleteFile(logo.id);

  await Sites().updateOne({
    _id: siteId,
  }, {
    $unset: {
      logo: 1,
    },
  });

  const site = await Sites().findOne({
    _id: siteId,
  });

  emitEvent(EventType.site_logo_removed, {
    site,
  });

  res.json(serializeSite(site));
}

export const removeSiteLogo = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
