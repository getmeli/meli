import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { params } from '../../../../commons/express-joi/params';
import {
  boolean, object, string,
} from 'joi';
import { $id } from '../../../../utils/id';
import { orgExistsGuard } from '../../guards/org-exists-guard';
import { body } from '../../../../commons/express-joi/body';
import { Orgs } from '../../org';
import { env } from '../../../../env';
import { sendInvite } from '../../../../emails/methods/send-invite';
import { serializeInvite } from '../../serialize-invite';
import { emitEvent } from '../../../../events/emit-event';
import { Invite } from '../../invite';
import { uuid } from '../../../../utils/uuid';
import { isAdminOrOwnerGuard } from '../../../../auth/guards/is-admin-or-owner-guard';
import { EventType } from '../../../../events/app-event';

const validators = [
  params(object({
    orgId: $id,
  })),
  body(object({
    email: string().email().required(),
    admin: boolean().optional().default(false),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;
  const { email, admin } = req.body;

  const invite: Invite = {
    _id: uuid(),
    email,
    token: uuid(),
    expiresAt: new Date(Date.now() + env.MELI_INVITE_EXPIRATION_TIME),
    memberOptions: {
      admin,
    },
  };

  await Orgs().updateOne({
    _id: orgId,
  }, {
    $push: {
      invites: invite,
    },
  });

  const org = await Orgs().findOne({
    _id: orgId,
  });

  await sendInvite(email, {
    org: org.name,
    url: `${env.MELI_UI_HOST.host}/invite?token=${invite.token}`,
  });

  emitEvent(EventType.org_invite_added, {
    org,
    invite,
  });

  res.json(serializeInvite(invite));
}

export const addInvite = [
  ...orgExistsGuard,
  ...isAdminOrOwnerGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
