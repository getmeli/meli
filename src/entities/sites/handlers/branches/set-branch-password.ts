import { Request, Response } from 'express';
import { Sites } from '../../site';
import { emitEvent } from '../../../../events/emit-event';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { body } from '../../../../commons/express-joi/body';
import { object, string } from 'joi';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { EventType } from '../../../../events/event-type';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { params } from '../../../../commons/express-joi/params';
import { $id } from '../../../../utils/id';
import { hashPassword } from '../../hash-password';
import { serializeBranch } from '../../serialize-branch';
import { configureSiteBranchInCaddy } from '../../../../caddy/configuration';

const validators = [
  params(object({
    siteId: $id,
    branchId: string().required(),
  })),
  body(object({
    password: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId } = req.params;
  const { password: plain } = req.body;

  const password = await hashPassword(plain);

  await Sites().updateOne(
    {
      _id: siteId,
      'branches._id': branchId,
    },
    {
      $set: {
        'branches.$.password': password,
      },
    },
  );

  const site = await Sites().findOne({
    _id: siteId,
  });
  const branch = site.branches.find(brch => brch._id === branchId);

  await configureSiteBranchInCaddy(site, branch);

  emitEvent(EventType.site_branch_password_set, {
    site,
    branch,
  });

  res.json(serializeBranch(site, branch));
}

export const setBranchPassword = [
  ...branchExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
