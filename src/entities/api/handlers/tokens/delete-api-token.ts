import { Request, Response } from 'express';
import { object, string } from 'joi';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../../events/emit-event';
import { params } from '../../../../commons/express-joi/params';
import { getUser } from '../../../../auth/utils/get-user';
import { ApiTokens } from '../../api-token';
import { apiTokenExistsGuard } from '../../guards/api-token-exists-guard';
import { canAdminApiToken } from '../../guards/can-admin-api-token';
import { EventType } from '../../../../events/app-event';

const validators = [
  params(object({
    apiTokenId: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { apiTokenId } = req.params;
  const user = getUser(req);

  const apiToken = await ApiTokens().findOne({
    _id: apiTokenId,
  });

  await ApiTokens().deleteOne({
    _id: apiTokenId,
  });

  emitEvent(EventType.user_api_token_deleted, {
    user,
    apiToken,
  });

  res.status(204).send();
}

export const deleteApiToken = [
  ...apiTokenExistsGuard,
  ...canAdminApiToken,
  ...validators,
  wrapAsyncMiddleware(handler),
];
