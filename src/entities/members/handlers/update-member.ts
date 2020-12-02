import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { body } from '../../../commons/express-joi/body';
import { emitEvent } from '../../../events/emit-event';
import { getUser } from '../../../auth/utils/get-user';
import { boolean, object } from 'joi';
import { $id } from '../../../utils/id';
import { Orgs } from '../../orgs/org';
import { memberExistsGuard } from '../guards/member-exists-guard';
import { serializeMember } from '../serialize-member';
import { params } from '../../../commons/express-joi/params';
import { BadRequestError } from '../../../commons/errors/bad-request-error';
import { Members } from '../member';
import { isOwner } from '../../users/guards/is-owner';
import { isAdminOrOwnerGuard } from '../../../auth/guards/is-admin-or-owner-guard';
import { EventType } from '../../../events/app-event';

const validators = [
  params(object({
    memberId: $id,
  })),
  body(object({
    admin: boolean().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { memberId } = req.params;
  const user = getUser(req);

  const { orgId } = await Members().findOne({
    _id: memberId,
  });
  const owner = await isOwner(user._id, orgId);

  // this is cosmetic, because we always check isOwner() || isAdmin()
  if (owner) {
    throw new BadRequestError('Cannot update owner, stop playing with the API...');
  }

  await Members().updateOne({
    _id: memberId,
  }, {
    $set: {
      admin: req.body.admin,
    },
  });

  const member = await Members().findOne({
    _id: memberId,
  });
  const org = await Orgs().findOne({
    _id: member.orgId,
  });

  emitEvent(EventType.org_member_updated, {
    org,
    member,
  });

  const json = await serializeMember(member, org.ownerId);
  res.json(json);
}

export const updateMember = [
  ...memberExistsGuard,
  ...isAdminOrOwnerGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
