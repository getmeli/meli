import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { object } from 'joi';
import { EventType } from '../../../events/event-type';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { upload } from '../../../upload';
import { storeFile } from '../../../storage/store-file';
import { canAdminSiteGuard } from '../guards/can-admin-site-guard';
import { siteExistsGuard } from '../guards/site-exists-guard';
import { serializeSite } from '../serialize-site';
import { Sites } from '../site';

const validators = [
  params(object({
    siteId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;
  const { file } = req;

  const storedFile = await storeFile(file);

  await Sites().updateOne(
    {
      _id: siteId,
    },
    {
      $set: {
        updatedAt: new Date(),
        logo: storedFile,
      },
    },
  );

  const site = await Sites().findOne({
    _id: siteId,
  });

  emitEvent(EventType.site_logo_set, {
    site,
  });

  res.json(serializeSite(site));
}

export const setSiteLogo = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  upload.single('file'),
  ...validators,
  wrapAsyncMiddleware(handler),
];
