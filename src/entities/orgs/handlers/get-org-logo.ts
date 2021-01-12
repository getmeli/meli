import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { object } from 'joi';
import { orgExistsGuard } from '../guards/org-exists-guard';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { isOrgMemberGuard } from '../guards/is-org-member-guard';
import { Orgs } from '../org';
import { getFilePath } from '../../../storage/get-file-path';

const validators = [
  params(object({
    orgId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;

  const org = await Orgs().findOne({ _id: orgId });

  const filePath = getFilePath(org.logo.id);

  res.header('Content-Type', org.logo.type);
  res.download(filePath);
}

export const getOrgLogo = [
  ...orgExistsGuard,
  ...isOrgMemberGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
