import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { $id } from '../../../../utils/id';
import { serializeProjectMember } from '../../serialize-project-member';
import { canReadProjectGuard } from '../../guards/can-read-project-guard';
import { Projects } from '../../project';
import { params } from '../../../../commons/express-joi/params';
import { object } from 'joi';
import { projectExistsGuard } from '../../guards/project-exists-guard';

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
  const json = await Promise.all(project.members.map(serializeProjectMember));
  res.json(json);
}

export const listMembers = [
  ...projectExistsGuard,
  ...canReadProjectGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
