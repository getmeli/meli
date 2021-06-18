import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { object } from 'joi';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { getFilePath } from '../../../storage/get-file-path';
import { projectExistsGuard } from '../guards/project-exists-guard';
import { canAdminProjectGuard } from '../guards/can-admin-project-guard';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { Projects } from '../project';

const validators = [
  params(object({
    projectId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { projectId } = req.params;

  const project = await Projects().findOne({ _id: projectId });

  if (!project.logo) {
    throw new NotFoundError('Project has no logo');
  }

  const filePath = getFilePath(project.logo.id);

  res.header('Content-Type', project.logo.type);
  res.download(filePath);
}

export const getProjectLogo = [
  ...projectExistsGuard,
  ...canAdminProjectGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
