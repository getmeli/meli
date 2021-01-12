import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { object } from 'joi';
import { EventType } from '../../../events/event-type';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { teamExistsGuard } from '../guards/team-exists-guard';
import { canAdminTeamGuard } from '../guards/can-admin-team-guard';
import { Teams } from '../team';
import { serializeTeam } from '../serialize-team';

const validators = [
  params(object({
    teamId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;

  await Teams().updateOne({
    _id: teamId,
  }, {
    $unset: {
      logo: 1,
    },
  });

  const team = await Teams().findOne({
    _id: teamId,
  });

  emitEvent(EventType.team_logo_removed, {
    team,
  });

  res.json(serializeTeam(team));
}

export const removeTeamLogo = [
  ...teamExistsGuard,
  ...canAdminTeamGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
