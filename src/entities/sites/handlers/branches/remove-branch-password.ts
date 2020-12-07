import { Request, Response } from 'express';
import { Sites } from '../../site';
import { emitEvent } from '../../../../events/emit-event';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { object, string } from 'joi';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { EventType } from '../../../../events/event-type';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { params } from '../../../../commons/express-joi/params';
import { $id } from '../../../../utils/id';
import { serializeBranch } from '../../serialize-branch';
import { configureSiteBranchInCaddy } from '../../../../caddy/configuration';

const validators = [
  params(object({
    siteId: $id,
    branchId: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId } = req.params;

  await Sites().updateOne(
    {
      _id: siteId,
      'branches._id': branchId,
    },
    {
      $unset: {
        'branches.$.password': 1,
      },
    },
  );

  const site = await Sites().findOne({
    _id: siteId,
  });
  const branch = site.branches.find(brch => brch._id === branchId);

  await configureSiteBranchInCaddy(site, branch);

  emitEvent(EventType.site_branch_password_removed, {
    site,
    branch,
  });

  res.json(serializeBranch(site, branch));
}

export const removeBranchPassword = [
  ...branchExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
