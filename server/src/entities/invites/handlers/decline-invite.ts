import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { params } from '../../../commons/express-joi/params';
import { object, string } from 'joi';
import { Orgs } from '../../orgs/org';
import { emitEvent } from '../../../events/emit-event';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { body } from '../../../commons/express-joi/body';
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

  await Orgs().updateOne({
    'invites._id': invite._id,
  }, {
    $pull: {
      invites: {
        _id: inviteId,
      },
    },
  });

  emitEvent(EventType.org_invite_declined, {
    org,
    invite,
  });

  res.status(204).send();
}

export const declineInvite = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
