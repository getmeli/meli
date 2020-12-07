import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { object } from 'joi';
import { $id } from '../../../utils/id';
import { emitEvent } from '../../../events/emit-event';
import { params } from '../../../commons/express-joi/params';
import { memberExistsGuard } from '../guards/member-exists-guard';
import { Teams } from '../../teams/team';
import { isOwner } from '../../users/guards/is-owner';
import { ForbiddenError } from '../../../commons/errors/forbidden-error';
import { Members } from '../member';
import { isAdminOrOwnerGuard } from '../../../auth/guards/is-admin-or-owner-guard';
import { EventType } from '../../../events/event-type';
import { Orgs } from '../../orgs/org';

const validators = [
  params(object({
    memberId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId, memberId } = req.params;

  const owner = await isOwner(orgId, memberId);
  if (owner) {
    throw new ForbiddenError('Cannot remove owner');
  }

  // remove from all teams
  await Teams().updateMany({
    orgId,
  }, {
    $pull: {
      members: memberId,
    },
  });

  const member = await Members().findOne({
    _id: memberId,
  });

  // remove from org
  await Members().deleteOne({
    _id: memberId,
  });

  const org = await Orgs().findOne({
    _id: orgId,
  });
  emitEvent(EventType.org_member_deleted, {
    org,
    member,
  });

  res.status(204).send();
}

export const deleteMember = [
  ...memberExistsGuard,
  ...isAdminOrOwnerGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
