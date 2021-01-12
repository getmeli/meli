import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { params } from '../../../commons/express-joi/params';
import { object, string } from 'joi';
import { Orgs } from '../../orgs/org';
import { emitEvent } from '../../../events/emit-event';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { body } from '../../../commons/express-joi/body';
import { Member, Members } from '../../members/member';
import { serializeUserOrg } from '../../orgs/serialize-user-org';
import { getUser } from '../../../auth/utils/get-user';
import { uuid } from '../../../utils/uuid';
import { EventType } from '../../../events/event-type';

const validators = [
  params(object({
    inviteId: string().required(),
  })),
  body(object({
    token: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { inviteId } = req.params;
  const { token } = req.body;

  const org = await Orgs().findOne({
    'invites._id': inviteId,
    'invites.token': token,
    'invites.expiresAt': {
      $gte: new Date(),
    },
  });

  if (!org) {
    throw new NotFoundError('Invite not found');
  }

  const invite = org.invites.find(({ _id }) => _id === inviteId);

  // remove invite so no one else uses it
  await Orgs().updateOne({
    _id: org._id,
  }, {
    $pull: {
      invites: {
        _id: inviteId,
      },
    },
  });

  const user = getUser(req);

  const member: Member = {
    _id: uuid(),
    userId: user._id,
    orgId: org._id,
    admin: invite.memberOptions.admin,
    name: user.name,
    email: user.email,
  };

  // add member to org
  await Members().insertOne(member);

  emitEvent(EventType.org_invite_accepted, {
    org,
    invite,
  });

  res.json(await serializeUserOrg(org, member));
}

export const acceptInvite = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
