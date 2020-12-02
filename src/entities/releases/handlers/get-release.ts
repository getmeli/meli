import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { serializeRelease } from '../serialize-release';
import { Releases } from '../release';
import { $id } from '../../../utils/id';
import { canAdminReleaseGuard } from '../guards/can-admin-release-guard';

const validators = [
  params(object({
    releaseId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { releaseId } = req.params;
  const release = await Releases().findOne({
    _id: releaseId,
  });
  res.json(serializeRelease(release));
}

export const getRelease = [
  ...canAdminReleaseGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
