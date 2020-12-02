import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { params } from '../../../../commons/express-joi/params';
import { Request, Response } from 'express';
import { object } from 'joi';
import { $id } from '../../../../utils/id';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { siteHookExistsGuard } from '../../guards/site-hook-exists-guard';
import { HookDeliveries } from '../../../../hooks/hook-delivery';
import {
  getPagination, pageResponse, pageValidators,
} from '../../../../utils/getPagination';
import { serializeHookDelivery } from '../../../../hooks/serialize-hook-delivery';
import { FilterQuery } from 'mongodb';
import { Hook } from '../../../../hooks/hook';

const validators = [
  params(object({
    siteId: $id,
    hookId: $id,
  })),
  ...pageValidators,
];

async function handler(req: Request, res: Response): Promise<void> {
  const { hookId } = req.params;
  const pagination = getPagination(req);

  const query: FilterQuery<Hook> = {
    hookId,
  };
  const count = await HookDeliveries().countDocuments(query);
  const deliveries = await HookDeliveries()
    .find(query)
    .limit(pagination.size)
    .skip(pagination.offset)
    .sort({
      date: -1,
    })
    .toArray();

  res.json(pageResponse(deliveries.map(serializeHookDelivery), count));
}

export const listSiteHookDeliveries = [
  ...siteHookExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
