import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { params } from '../../../../commons/express-joi/params';
import { Request, Response } from 'express';
import { object } from 'joi';
import { $id } from '../../../../utils/id';
import { siteEvents } from './site-hook';

const validators = [
  params(object({
    siteId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  res.json(siteEvents);
}

export const listSiteEvents = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
