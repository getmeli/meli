import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { Sites } from '../../site';
import { serializeBranch } from '../../serialize-branch';

const validators = [];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
    'branches._id': branchId,
  });
  const branch = site.branches.find(brch => brch._id === branchId);

  res.json(serializeBranch(site, branch));
}

export const getBranch = [
  ...canAdminSiteGuard,
  ...branchExistsGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
