import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { teamExistsGuard } from '../../guards/team-exists-guard';
import { object } from 'joi';
import { Teams } from '../../team';
import { $id } from '../../../../utils/id';
import { emitEvent } from '../../../../events/emit-event';
import { params } from '../../../../commons/express-joi/params';
import { BadRequestError } from '../../../../commons/errors/bad-request-error';
import { canAdminTeamGuard } from '../../guards/can-admin-team-guard';
import { EventType } from '../../../../events/app-event';

const validators = [
  params(object({
    teamId: $id,
    memberId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { teamId, memberId } = req.params;

  const { matchedCount } = await Teams().updateOne({
    _id: teamId,
  }, {
    $pull: {
      members: memberId,
    },
  });

  if (matchedCount === 0) {
    throw new BadRequestError('Not a team member');
  }

  emitEvent(EventType.team_member_deleted, {
    team: await Teams().findOne({
      _id: teamId,
    }),
    member: memberId,
  });
  res.status(204).send();
}

export const deleteMember = [
  ...teamExistsGuard,
  ...canAdminTeamGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
