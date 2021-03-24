import { Request, Response } from 'express';
import { emitEvent } from '../../../events/emit-event';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { body } from '../../../commons/express-joi/body';
import { object, string } from 'joi';
import { Releases } from '../release';
import { serializeRelease } from '../serialize-release';
import { canAdminReleaseGuard } from '../guards/can-admin-release-guard';
import { EventType } from '../../../events/event-type';
import { Sites } from '../../sites/site';

const validators = [
  body(object({
    name: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { releaseId } = req.params;

  const { name } = req.body;

  await Releases().updateOne({
    _id: releaseId,
    name: {
      $ne: name,
    },
  }, {
    $set: {
      name,
    },
  });

  const release = await Releases().findOne({
    _id: releaseId,
  });

  emitEvent(EventType.site_release_renamed, {
    site: await Sites().findOne({
      _id: release.siteId,
    }),
    release,
  });

  res.json(serializeRelease(release));
}

export const updateRelease = [
  ...canAdminReleaseGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
