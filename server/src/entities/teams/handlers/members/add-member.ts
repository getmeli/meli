import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { teamExistsGuard } from '../../guards/team-exists-guard';
import { object } from 'joi';
import { Teams } from '../../team';
import { $id } from '../../../../utils/id';
import { emitEvent } from '../../../../events/emit-event';
import { BadRequestError } from '../../../../commons/errors/bad-request-error';
import { serializeTeamMember } from '../../serialize-team-member';
import { NotFoundError } from '../../../../commons/errors/not-found-error';
import { params } from '../../../../commons/express-joi/params';
import { Members } from '../../../members/member';
import { canAdminTeamGuard } from '../../guards/can-admin-team-guard';
import { EventType } from '../../../../events/event-type';
import { Orgs } from '../../../orgs/org';
import { orgMemberExistsGuard } from '../../guards/org-member-exists-guard';

const validators = [
  params(object({
    teamId: $id,
    memberId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { teamId, memberId } = req.params;

  const team = await Teams().findOne({ _id: teamId });
  const org = await Orgs().findOne({ _id: team.orgId });
  const member = await Members().findOne({ _id: memberId });

  if (!member) {
    throw new NotFoundError('Org member not found');
  }

  const { matchedCount } = await Teams().updateOne({
    _id: teamId,
    members: {
      $ne: memberId,
    },
  }, {
    $addToSet: {
      members: memberId,
    },
  });

  if (matchedCount === 0) {
    throw new BadRequestError('User already member of team');
  }

  emitEvent(EventType.team_member_added, {
    org,
    team,
    member,
  });
  res.json(await serializeTeamMember(memberId));
}

export const addMember = [
  ...teamExistsGuard,
  ...canAdminTeamGuard,
  ...orgMemberExistsGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
