import { Request, Response } from 'express';
import { object } from 'joi';
import { params } from '../../../../commons/express-joi/params';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Sites } from '../../site';
import { siteExistsGuard } from '../../guards/site-exists-guard';
import { serializeBranch } from '../../serialize-branch';
import { $id } from '../../../../utils/id';
import { canListBranchesGuard } from '../../guards/can-list-branches-guard';

const validators = [
  params(object({
    siteId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
  });

  res.json(site.branches?.map(chan => serializeBranch(site, chan)) || []);
}

export const listBranches = [
  ...siteExistsGuard,
  ...canListBranchesGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
