import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { body } from '../../../commons/express-joi/body';
import { emitEvent } from '../../../events/emit-event';
import { object, string } from 'joi';
import { COLOR_PATTERN, STRING_MAX_LENGTH } from '../../../constants';
import { projectExistsGuard } from '../guards/project-exists-guard';
import { serializeProject } from '../serialize-project';
import { Projects } from '../project';
import { canAdminProjectGuard } from '../guards/can-admin-project-guard';
import { EventType } from '../../../events/event-type';

const validators = [
  body(object({
    name: string().required().max(STRING_MAX_LENGTH),
    color: string().required().regex(COLOR_PATTERN),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { projectId } = req.params;

  await Projects().updateOne(
    {
      _id: projectId,
    },
    {
      $set: {
        updatedAt: new Date(),
        name: req.body.name,
        color: req.body.color,
      },
    },
  );

  const project = await Projects().findOne({
    _id: projectId,
  });

  res.json(serializeProject(project));
  emitEvent(EventType.project_updated, {
    project,
  });
}

export const updateProject = [
  ...projectExistsGuard,
  ...canAdminProjectGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
