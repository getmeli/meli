import { Request, Response } from 'express';
import { Sites } from '../../site';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { object, string } from 'joi';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { params } from '../../../../commons/express-joi/params';
import { $id } from '../../../../utils/id';
import { serializeRedirect } from '../../serialize-redirect';

const validators = [
  params(object({
    siteId: $id,
    branchId: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
  });
  const branch = site.branches.find(brch => brch._id === branchId);

  res.json((branch.redirects || []).map(r => serializeRedirect(site, branch, r)));
}

export const listBranchRedirects = [
  ...branchExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
