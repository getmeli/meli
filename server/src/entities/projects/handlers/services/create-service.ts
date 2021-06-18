import { Request, Response } from 'express';
import { object } from 'joi';
import randomColor from 'randomcolor';
import { configureServiceInCaddy } from '../../../../caddy/configuration';
import { body } from '../../../../commons/express-joi/body';
import { params } from '../../../../commons/express-joi/params';
import { Logger } from '../../../../commons/logger/logger';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../../events/emit-event';
import { EventType } from '../../../../events/event-type';
import { generateTokenValue } from '../../../../utils/generate-token-value';
import { $id } from '../../../../utils/id';
import { uuid } from '../../../../utils/uuid';
import { serializeService } from '../../../services/serialize-service';
import { Service, Services } from '../../../services/service';
import { $siteName } from '../../../sites/site';
import { canAdminProjectGuard } from '../../guards/can-admin-project-guard';
import { projectExistsGuard } from '../../guards/project-exists-guard';
import { Projects } from '../../project';

const logger = new Logger('meli.api:createService');

const validators = [
  params(object({
    projectId: $id,
  })),
  body(object({
    name: $siteName,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { projectId } = req.params;

  const service: Service = {
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

  await Services().insertOne(service);
  configureServiceInCaddy(service).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.service_added, {
    project: await Projects().findOne({
      _id: projectId,
    }),
    service,
  });

  res.json(serializeService(service));
}

export const createSite = [
  ...projectExistsGuard,
  ...canAdminProjectGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
