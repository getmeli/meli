import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { apiEndpoints } from '../../api-endpoint';
import { serializeEndpoint } from '../../serialize-endpoint';

const validators = [];

async function handler(req: Request, res: Response): Promise<void> {
  const json = apiEndpoints.map(serializeEndpoint);
  res.json(json);
}

export const listApiEndpoints = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
