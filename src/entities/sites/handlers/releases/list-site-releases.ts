import { Request, Response } from 'express';
import { object, string } from 'joi';
import { params } from '../../../../commons/express-joi/params';
import { query } from '../../../../commons/express-joi/query';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Release, Releases } from '../../../releases/release';
import {
  getPagination, pageResponse, pageValidators,
} from '../../../../utils/getPagination';
import { siteExistsGuard } from '../../guards/site-exists-guard';
import { FilterQuery } from 'mongodb';
import { $id } from '../../../../utils/id';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { STRING_MAX_LENGTH } from '../../../../constants';
import { serializeRelease } from '../../../releases/serialize-release';

const validators = [
  ...pageValidators,
  params(object({
    siteId: $id,
  })),
  query({
    search: {
      $schema: string().optional().min(3).max(255),
    },
    branch: {
      $schema: string().optional().max(STRING_MAX_LENGTH),
    },
  }),
];

async function handler(req: Request, res: Response): Promise<void> {
  const pagination = getPagination(req);

  const dbQuery: FilterQuery<Release> = {
    siteId: req.params.siteId,
  };
  if (req.query.search) {
    dbQuery.$text = {
      $search: req.query.search as string,
    };
  }
  if (req.query.branch) {
    dbQuery.branches = req.query.branch as string;
  }

  const count = await Releases()
    .find(dbQuery)
    .count();

  const releases = await Releases()
    .find(dbQuery)
    .sort({
      date: -1,
    })
    .skip(pagination.offset)
    .limit(pagination.size)
    .toArray();

  res.json(pageResponse(releases.map(serializeRelease), count));
}

export const listSiteReleases = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
