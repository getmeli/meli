import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { object } from 'joi';
import { Orgs } from '../org';
import { serializeOrg } from '../serialize-org';
import { canWriteOrgGuard } from '../guards/can-write-org-guard';
import { orgExistsGuard } from '../guards/org-exists-guard';
import { EventType } from '../../../events/event-type';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { upload } from '../../../upload';
import { storeFile } from '../../../storage/store-file';
import { deleteFile } from '../../../storage/delete-file';

const validators = [
  params(object({
    orgId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;
  const { file } = req;

  const { logo: oldLogo } = await Orgs().findOne({
    _id: orgId,
  });

  const storedFile = await storeFile(file);

  await Orgs().updateOne(
    {
      _id: orgId,
    },
    {
      $set: {
        updatedAt: new Date(),
        logo: storedFile,
      },
    },
  );

  if (!oldLogo) {
    await deleteFile(oldLogo.id);
  }

  const org = await Orgs().findOne({
    _id: orgId,
  });

  emitEvent(EventType.org_logo_set, {
    org,
  });

  res.json(serializeOrg(org));
}

export const setOrgLogo = [
  ...orgExistsGuard,
  ...canWriteOrgGuard,
  upload.single('file'),
  ...validators,
  wrapAsyncMiddleware(handler),
];
