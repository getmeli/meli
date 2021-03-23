import { body } from '../../../../commons/express-joi/body';
import { Request, Response } from 'express';
import { uuid } from '../../../../utils/uuid';
import { emitEvent } from '../../../../events/emit-event';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { getUser } from '../../../../auth/utils/get-user';
import { $apiToken, ApiToken, ApiTokens } from '../../api-token';
import { EventType } from '../../../../events/event-type';
import { generateTokenValue } from '../../../../utils/generate-token-value';
import { serializeApiToken } from '../../serialize-api-token';

const validators = [
  body($apiToken),
];

async function handler(req: Request, res: Response): Promise<void> {
  const user = getUser(req);

  const apiToken: ApiToken = {
    _id: uuid(),
    userId: user._id,
    createdAt: new Date(),
    value: generateTokenValue(),
    name: req.body.name,
    activatesAt: req.body.activatesAt,
    expiresAt: req.body.expiresAt,
    scopes: req.body.scopes,
  };

  await ApiTokens().insertOne(apiToken);

  emitEvent(EventType.user_api_token_created, {
    user,
    apiToken,
  });

  res.json(serializeApiToken(apiToken));
}

/*
 * NEVER ALLOW THIS ENDPOINT TO BE USED VIA API
 * AS IT WILL ALLOW PRIVILEGE ESCALATION BY CREATING
 * NEW TOKENS WITH ADDITIONAL SCOPES
 */
export const createApiToken = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
