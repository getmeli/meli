import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { serializeApiToken } from '../../serialize-api-token';
import { getUser } from '../../../../auth/utils/get-user';
import { ApiTokens } from '../../api-token';

const validators = [];

async function handler(req: Request, res: Response): Promise<void> {
  const { _id } = getUser(req);

  const apiTokens = await ApiTokens()
    .find({
      userId: _id,
    })
    .toArray();

  res.json(apiTokens.map(serializeApiToken));
}

export const listApiTokens = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
