import { body } from '../../../../commons/express-joi/body';
import { Request, Response } from 'express';
import { emitEvent } from '../../../../events/emit-event';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { getUser } from '../../../../auth/utils/get-user';
import { $apiToken, ApiTokens } from '../../api-token';
import { serializeApiToken } from '../../serialize-api-token';
import { params } from '../../../../commons/express-joi/params';
import { object } from 'joi';
import { $id } from '../../../../utils/id';
import { apiTokenExistsGuard } from '../../guards/api-token-exists-guard';
import { canAdminApiToken } from '../../guards/can-admin-api-token';
import { EventType } from '../../../../events/app-event';

const validators = [
  params(object({
    apiTokenId: $id,
  })),
  body($apiToken),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { apiTokenId } = req.params;
  const user = getUser(req);

  await ApiTokens().updateOne({
    _id: apiTokenId,
  }, {
    $set: {
      updatedAt: new Date(),
      name: req.body.name,
      activatesAt: req.body.activatesAt,
      expiresAt: req.body.expiresAt,
      scopes: req.body.scopes,
    },
  });

  const apiToken = await ApiTokens().findOne({
    _id: apiTokenId,
  });

  emitEvent(EventType.user_api_token_updated, {
    user,
    apiToken,
  });

  res.json(serializeApiToken(apiToken));
}

export const updateApiToken = [
  ...apiTokenExistsGuard,
  ...canAdminApiToken,
  ...validators,
  wrapAsyncMiddleware(handler),
];
