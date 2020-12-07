import { Request, Response } from 'express';
import { configureSiteInCaddy } from '../../../../caddy/configuration';
import { body } from '../../../../commons/express-joi/body';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { $siteName, Site, Sites } from '../../../sites/site';
import { serializeSite } from '../../../sites/serialize-site';
import { emitEvent } from '../../../../events/emit-event';
import { object } from 'joi';
import randomColor from 'randomcolor';
import { params } from '../../../../commons/express-joi/params';
import { $id } from '../../../../utils/id';
import { uuid } from '../../../../utils/uuid';
import { canAdminTeamGuard } from '../../guards/can-admin-team-guard';
import { teamExistsGuard } from '../../guards/team-exists-guard';
import { EventType } from '../../../../events/event-type';
import { Teams } from '../../team';
import { generateTokenValue } from '../../../../utils/generate-token-value';

const validators = [
  params(object({
    teamId: $id,
  })),
  body(object({
    name: $siteName,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;

  const site: Site = {
    _id: uuid(),
    teamId,
    color: randomColor(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: req.body.name,
    domains: [],
    branches: [],
    tokens: [{
      _id: uuid(),
      name: 'first token',
      value: generateTokenValue(),
      createdAt: new Date(),
    }],
    hooks: [],
  };

  await Sites().insertOne(site);
  await configureSiteInCaddy(site);

  emitEvent(EventType.team_site_added, {
    team: await Teams().findOne({
      _id: teamId,
    }),
    site,
  });

  res.json(serializeSite(site));
}

export const addSite = [
  ...teamExistsGuard,
  ...canAdminTeamGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
