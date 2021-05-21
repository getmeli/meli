import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { object } from 'joi';
import { EventType } from '../../../events/event-type';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { projectExistsGuard } from '../guards/project-exists-guard';
import { canAdminProjectGuard } from '../guards/can-admin-project-guard';
import { Projects } from '../project';
import { serializeProject } from '../serialize-project';
import { deleteFile } from '../../../storage/delete-file';
import { BadRequestError } from '../../../commons/errors/bad-request-error';

const validators = [
  params(object({
    projectId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { projectId } = req.params;

  const { logo } = await Projects().findOne({
    _id: projectId,
  });

  if (!logo) {
    throw new BadRequestError('Project has no logo');
  }

  await deleteFile(logo.id);

  await Projects().updateOne({
    _id: projectId,
  }, {
    $unset: {
      logo: 1,
    },
  });

  const project = await Projects().findOne({
    _id: projectId,
  });

  emitEvent(EventType.project_logo_removed, {
    project,
  });

  res.json(serializeProject(project));
}

export const removeProjectLogo = [
  ...projectExistsGuard,
  ...canAdminProjectGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
