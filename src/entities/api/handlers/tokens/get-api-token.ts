import { Request, Response } from 'express';
import { object, string } from 'joi';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { params } from '../../../../commons/express-joi/params';
import { ApiTokens } from '../../api-token';
import { apiTokenExistsGuard } from '../../guards/api-token-exists-guard';
import { canAdminApiTokenGuard } from '../../guards/can-admin-api-token-guard';
import { serializeApiToken } from '../../serialize-api-token';

const validators = [
  params(object({
    apiTokenId: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { apiTokenId } = req.params;

  const apiToken = await ApiTokens().findOne({
    _id: apiTokenId,
  });

  res.json(serializeApiToken(apiToken));
}

export const getApiToken = [
  ...apiTokenExistsGuard,
  ...canAdminApiTokenGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
