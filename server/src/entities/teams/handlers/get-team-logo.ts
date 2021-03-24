import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { object } from 'joi';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';
import { getFilePath } from '../../../storage/get-file-path';
import { teamExistsGuard } from '../guards/team-exists-guard';
import { canAdminTeamGuard } from '../guards/can-admin-team-guard';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { Teams } from '../team';

const validators = [
  params(object({
    teamId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;

  const team = await Teams().findOne({ _id: teamId });

  if (!team.logo) {
    throw new NotFoundError('Team has no logo');
  }

  const filePath = getFilePath(team.logo.id);

  res.header('Content-Type', team.logo.type);
  res.download(filePath);
}

export const getTeamLogo = [
  ...teamExistsGuard,
  ...canAdminTeamGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
