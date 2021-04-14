import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { object, string } from 'joi';
import { $id } from '../../../../utils/id';
import { emitEvent } from '../../../../events/emit-event';
import { params } from '../../../../commons/express-joi/params';
import { Orgs } from '../../org';
import { inviteExistsGuard } from '../../guards/invite-exists-guard';
import { isAdminOrOwnerGuard } from '../../../../auth/guards/is-admin-or-owner-guard';
import { EventType } from '../../../../events/event-type';

const validators = [
  params(object({
    orgId: $id,
    inviteId: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId, inviteId } = req.params;

  const org = await Orgs().findOne({
    _id: orgId,
  });
  const invite = org.invites.find(({ _id }) => _id === inviteId);

  // remove from org
  await Orgs().updateOne({
    _id: orgId,
  }, {
    $pull: {
      invites: {
        _id: inviteId,
      },
    },
  });

  emitEvent(EventType.org_invite_deleted, {
    org,
    invite,
  });

  res.status(204).send();
}

export const deleteInvite = [
  ...inviteExistsGuard,
  ...isAdminOrOwnerGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
