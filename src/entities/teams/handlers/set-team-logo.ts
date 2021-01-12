import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { object } from 'joi';
import { EventType } from '../../../events/event-type';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { upload } from '../../../upload';
import { storeFile } from '../../../storage/store-file';
import { teamExistsGuard } from '../guards/team-exists-guard';
import { canAdminTeamGuard } from '../guards/can-admin-team-guard';
import { Teams } from '../team';
import { serializeTeam } from '../serialize-team';
import { deleteFile } from '../../../storage/delete-file';

const validators = [
  params(object({
    teamId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;
  const { file } = req;

  const { logo: oldLogo } = await Teams().findOne({
    _id: teamId,
  });

  const storedFile = await storeFile(file);

  await Teams().updateOne(
    {
      _id: teamId,
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

  const team = await Teams().findOne({
    _id: teamId,
  });

  emitEvent(EventType.team_logo_set, {
    team,
  });

  res.json(serializeTeam(team));
}

export const setTeamLogo = [
  ...teamExistsGuard,
  ...canAdminTeamGuard,
  upload.single('file'),
  ...validators,
  wrapAsyncMiddleware(handler),
];
