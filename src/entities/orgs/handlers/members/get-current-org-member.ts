import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Orgs } from '../../org';
import { $id } from '../../../../utils/id';
import { getUser } from '../../../../auth/utils/get-user';
import { params } from '../../../../commons/express-joi/params';
import { object } from 'joi';
import { serializeMember } from '../../../members/serialize-member';
import { Members } from '../../../members/member';
import { orgExistsGuard } from '../../guards/org-exists-guard';
import { isOrgMemberGuard } from '../../guards/is-org-member-guard';

const validators = [
  params(object({
    orgId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;
  const user = getUser(req);

  const member = await Members().findOne({
    orgId,
    userId: user._id,
  });
  const org = await Orgs().findOne({
    _id: orgId,
  });

  res.json(await serializeMember(member, org.ownerId));
}

export const getCurrentOrgMember = [
  ...orgExistsGuard,
  ...isOrgMemberGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
