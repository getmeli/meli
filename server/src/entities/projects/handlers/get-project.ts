import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { canReadProjectGuard } from '../guards/can-read-project-guard';
import { projectExistsGuard } from '../guards/project-exists-guard';
import { $id } from '../../../utils/id';
import { serializeProject } from '../serialize-project';
import { Projects } from '../project';

const validators = [
  params(object({
    projectId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { projectId } = req.params;
  const project = await Projects().findOne({
    _id: projectId,
  });
  res.json(serializeProject(project));
}

export const getProject = [
  ...projectExistsGuard,
  ...canReadProjectGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
