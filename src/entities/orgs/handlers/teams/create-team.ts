import { Request, Response } from 'express';
import { body } from '../../../../commons/express-joi/body';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Team, Teams } from '../../../teams/team';
import { serializeTeam } from '../../../teams/serialize-team';
import { emitEvent } from '../../../../events/emit-event';
import { object, string } from 'joi';
import { STRING_MAX_LENGTH } from '../../../../constants';
import randomColor from 'randomcolor';
import { params } from '../../../../commons/express-joi/params';
import { $id } from '../../../../utils/id';
import { orgExistsGuard } from '../../guards/org-exists-guard';
import { uuid } from '../../../../utils/uuid';
import { isAdminOrOwnerGuard } from '../../../../auth/guards/is-admin-or-owner-guard';
import { EventType } from '../../../../events/event-type';
import { Orgs } from '../../org';

const validators = [
  params(object({
    orgId: $id,
  })),
  body(object({
    name: string().required().max(STRING_MAX_LENGTH),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;
  const team: Team = {
    _id: uuid(),
    orgId,
    color: randomColor(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: req.body.name,
    members: [],
    hooks: [],
  };

  await Teams().insertOne(team);

  emitEvent(EventType.org_team_added, {
    org: await Orgs().findOne({
      _id: orgId,
    }),
    team,
  });

  res.json(serializeTeam(team));
}

export const createTeam = [
  ...orgExistsGuard,
  ...isAdminOrOwnerGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
