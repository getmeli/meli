import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { body } from '../../../commons/express-joi/body';
import { emitEvent } from '../../../events/emit-event';
import { object, string } from 'joi';
import { COLOR_PATTERN, STRING_MAX_LENGTH } from '../../../constants';
import { teamExistsGuard } from '../guards/team-exists-guard';
import { serializeTeam } from '../serialize-team';
import { Teams } from '../team';
import { canAdminTeamGuard } from '../guards/can-admin-team-guard';
import { EventType } from '../../../events/event-type';

const validators = [
  body(object({
    name: string().required().max(STRING_MAX_LENGTH),
    color: string().required().regex(COLOR_PATTERN),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;

  await Teams().updateOne(
    {
      _id: teamId,
    },
    {
      $set: {
        updatedAt: new Date(),
        name: req.body.name,
        color: req.body.color,
      },
    },
  );

  const team = await Teams().findOne({
    _id: teamId,
  });

  res.json(serializeTeam(team));
  emitEvent(EventType.team_updated, {
    team,
  });
}

export const updateTeam = [
  ...teamExistsGuard,
  ...canAdminTeamGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
