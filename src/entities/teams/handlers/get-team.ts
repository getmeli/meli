import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { canReadTeamGuard } from '../guards/can-read-team-guard';
import { teamExistsGuard } from '../guards/team-exists-guard';
import { $id } from '../../../utils/id';
import { serializeTeam } from '../serialize-team';
import { Teams } from '../team';

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
  res.json(serializeTeam(team));
}

export const getTeam = [
  ...teamExistsGuard,
  ...canReadTeamGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
