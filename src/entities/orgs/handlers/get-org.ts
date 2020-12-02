import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { isOrgMemberGuard } from '../guards/is-org-member-guard';
import { orgExistsGuard } from '../guards/org-exists-guard';
import { $id } from '../../../utils/id';
import { serializeOrg } from '../serialize-org';
import { Orgs } from '../org';

const validators = [
  params(object({
    orgId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;
  const org = await Orgs().findOne({
    _id: orgId,
  });
  res.json(serializeOrg(org));
}

export const getOrg = [
  ...orgExistsGuard,
  ...isOrgMemberGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
