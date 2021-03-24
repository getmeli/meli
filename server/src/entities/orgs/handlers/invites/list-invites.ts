import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Orgs } from '../../org';
import { $id } from '../../../../utils/id';
import { params } from '../../../../commons/express-joi/params';
import { object } from 'joi';
import { serializeInvite } from '../../serialize-invite';
import { isAdminOrOwnerGuard } from '../../../../auth/guards/is-admin-or-owner-guard';
import { orgExistsGuard } from '../../guards/org-exists-guard';

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

  const json = org.invites?.map(invite => serializeInvite(invite)) || [];
  res.json(json);
}

export const listInvites = [
  ...orgExistsGuard,
  ...isAdminOrOwnerGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
