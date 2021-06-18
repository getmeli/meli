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
import { canAdminProjectGuard } from '../../guards/can-admin-project-guard';
import { projectExistsGuard } from '../../guards/project-exists-guard';
import { EventType } from '../../../../events/event-type';
import { Projects } from '../../project';
import { generateTokenValue } from '../../../../utils/generate-token-value';
import { Logger } from '../../../../commons/logger/logger';

const validators = [
  params(object({
    projectId: $id,
  })),
  body(object({
    name: $siteName,
  })),
];

const logger = new Logger('meli.api:createSite');

async function handler(req: Request, res: Response): Promise<void> {
  const { projectId } = req.params;

  const site: Site = {
    _id: uuid(),
    projectId,
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
  configureSiteInCaddy(site).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_added, {
    project: await Projects().findOne({
      _id: projectId,
    }),
    site,
  });

  res.json(serializeSite(site));
}

export const createSite = [
  ...projectExistsGuard,
  ...canAdminProjectGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
