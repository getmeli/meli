import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { $id } from '../../../../utils/id';
import { serializeTeamMember } from '../../serialize-team-member';
import { canReadTeamGuard } from '../../guards/can-read-team-guard';
import { Teams } from '../../team';
import { params } from '../../../../commons/express-joi/params';
import { object } from 'joi';
import { teamExistsGuard } from '../../guards/team-exists-guard';

const validators = [
  params(object({
    teamId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;
  const team = await Teams().findOne({
    _id: teamId,
  });
  const json = await Promise.all(team.members.map(serializeTeamMember));
  res.json(json);
}

export const listMembers = [
  ...teamExistsGuard,
  ...canReadTeamGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
