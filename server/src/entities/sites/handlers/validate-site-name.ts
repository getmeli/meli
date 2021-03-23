import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { body } from '../../../commons/express-joi/body';
import { object, string } from 'joi';
import { STRING_MAX_LENGTH } from '../../../constants';
import { Sites } from '../site';

const validators = [
  body(object({
    name: string().required().max(STRING_MAX_LENGTH),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { name } = req.body;
  // TODO check domain not used across multiple sites
  const count = await Sites().countDocuments({
    name,
  }, {
    limit: 1,
  });
  res.json(count > 0 ? 'Site name already exists' : undefined);
}

export const validateSiteName = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
