import { Request, Response } from 'express';
import { object } from 'joi';
import { params } from '../../../commons/express-joi/params';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { teamExistsGuard } from '../guards/team-exists-guard';
import { Teams } from '../team';
import { $id } from '../../../utils/id';
import { Sites } from '../../sites/site';
import { Releases } from '../../releases/release';
import { canAdminTeamGuard } from '../guards/can-admin-team-guard';
import { EventType } from '../../../events/app-event';

const validators = [
  params(object({
    teamId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;

  const sites = await Sites().find({
    teamId,
  }).project({
    _id: 1,
  }).toArray();

  // site -> releases
  await Releases().deleteMany({
    siteId: {
      $in: sites.map(({ _id }) => _id),
    },
  });

  // team -> sites
  await Sites().deleteMany({
    teamId,
  });

  const team = await Teams().findOne({
    _id: teamId,
  });

  // team
  await Teams().deleteOne({
    _id: teamId,
  });

  emitEvent(EventType.team_deleted, {
    team,
  });
  res.status(204).send();
}

export const deleteTeam = [
  ...teamExistsGuard,
  ...canAdminTeamGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
