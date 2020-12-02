import { Request, Response } from 'express';
import {
  getPagination, pageResponse, pageValidators,
} from '../../../../utils/getPagination';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { object, string } from 'joi';
import { query } from '../../../../commons/express-joi/query';
import { Site, Sites } from '../../../sites/site';
import { params } from '../../../../commons/express-joi/params';
import { FilterQuery } from 'mongodb';
import { canReadTeamGuard } from '../../guards/can-read-team-guard';
import { teamExistsGuard } from '../../guards/team-exists-guard';

const validators = [
  ...pageValidators,
  params(object({
    teamId: string().optional(),
  })),
  query({
    search: {
      $schema: string().optional().min(3).max(255),
    },
  }),
];

async function handler(req: Request, res: Response): Promise<void> {
  const pagination = getPagination(req);
  const { teamId } = req.params;
  const { search } = req.query;

  const dbQuery: FilterQuery<Site> = {
    teamId,
    ...(
      search
        ? {
          $text: {
            $search: search,
          },
        }
        : undefined as any
    ),
  };

  const count = await Sites()
    .find(dbQuery)
    .count();

  const sites = await Sites()
    .find(dbQuery)
    .sort({
      updatedAt: -1,
    })
    .skip(pagination.offset)
    .limit(pagination.size)
    .toArray();

  res.json(pageResponse(sites, count));
}

export const listSites = [
  ...teamExistsGuard,
  ...canReadTeamGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
