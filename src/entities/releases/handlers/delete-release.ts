import { Request, Response } from 'express';
import { object } from 'joi';
import { params } from '../../../commons/express-joi/params';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { Releases } from '../release';
import { Sites } from '../../sites/site';
import { $id } from '../../../utils/id';
import { getReleaseDir } from '../../sites/get-site-dir';
import { promises as fs } from 'fs';
import { canAdminReleaseGuard } from '../guards/can-admin-release-guard';
import { EventType } from '../../../events/app-event';
import { Logger } from '../../../commons/logger/logger';

const validators = [
  params(object({
    releaseId: $id,
  })),
];

const logger = new Logger('meli.api:deleteRelease');

async function handler(req: Request, res: Response): Promise<void> {
  const { releaseId } = req.params;

  const release = await Releases().findOne({
    _id: releaseId,
  });

  // remove release from storage
  const releaseDirectory = getReleaseDir(release);
  try {
    await fs.rmdir(releaseDirectory, {
      recursive: true,
    });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    } else {
      logger.warn('Could not delete release ', releaseId, ' dir', releaseDirectory);
    }
  }

  await Releases().deleteOne({
    _id: releaseId,
  });

  // remove branches that use this release
  await Sites().updateOne({
    _id: release.siteId,
    'branches.release': releaseId,
  }, {
    $unset: {
      'branches.$.release': 1,
    },
  });

  emitEvent(EventType.site_release_deleted, {
    site: await Sites().findOne({
      _id: release.siteId,
    }),
    release,
  });

  res.status(204).send();
}

export const deleteRelease = [
  ...canAdminReleaseGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
