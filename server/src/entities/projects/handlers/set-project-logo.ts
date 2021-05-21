import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { object } from 'joi';
import { EventType } from '../../../events/event-type';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { upload } from '../../../upload';
import { storeFile } from '../../../storage/store-file';
import { projectExistsGuard } from '../guards/project-exists-guard';
import { canAdminProjectGuard } from '../guards/can-admin-project-guard';
import { Projects } from '../project';
import { serializeProject } from '../serialize-project';
import { deleteFile } from '../../../storage/delete-file';

const validators = [
  params(object({
    projectId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { projectId } = req.params;
  const { file } = req;

  const { logo: oldLogo } = await Projects().findOne({
    _id: projectId,
  });

  const storedFile = await storeFile(file);

  await Projects().updateOne(
    {
      _id: projectId,
    },
    {
      $set: {
        updatedAt: new Date(),
        logo: storedFile,
      },
    },
  );

  if (oldLogo) {
    await deleteFile(oldLogo.id);
  }

  const project = await Projects().findOne({
    _id: projectId,
  });

  emitEvent(EventType.project_logo_set, {
    project,
  });

  res.json(serializeProject(project));
}

export const setProjectLogo = [
  ...projectExistsGuard,
  ...canAdminProjectGuard,
  upload.single('file'),
  ...validators,
  wrapAsyncMiddleware(handler),
];
