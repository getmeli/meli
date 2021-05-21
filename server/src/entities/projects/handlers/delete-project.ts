import { Request, Response } from 'express';
import { object } from 'joi';
import { params } from '../../../commons/express-joi/params';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { projectExistsGuard } from '../guards/project-exists-guard';
import { Projects } from '../project';
import { $id } from '../../../utils/id';
import { Sites } from '../../sites/site';
import { Releases } from '../../releases/release';
import { canAdminProjectGuard } from '../guards/can-admin-project-guard';
import { EventType } from '../../../events/event-type';

const validators = [
  params(object({
    projectId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { projectId } = req.params;

  const sites = await Sites().find({
    projectId,
  }).project({
    _id: 1,
  }).toArray();

  // site -> releases
  await Releases().deleteMany({
    siteId: {
      $in: sites.map(({ _id }) => _id),
    },
  });

  // project -> sites
  await Sites().deleteMany({
    projectId,
  });

  const project = await Projects().findOne({
    _id: projectId,
  });

  // project
  await Projects().deleteOne({
    _id: projectId,
  });

  emitEvent(EventType.project_deleted, {
    project,
  });
  res.status(204).send();
}

export const deleteProject = [
  ...projectExistsGuard,
  ...canAdminProjectGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
