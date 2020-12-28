import { Request, Response } from 'express';
import { Site, Sites } from '../../../sites/site';
import { object, string } from 'joi';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { getPagination, pageResponse, pageValidators } from '../../../../utils/getPagination';
import { FilterQuery } from 'mongodb';
import { query } from '../../../../commons/express-joi/query';
import { Teams } from '../../../teams/team';
import { getUser } from '../../../../auth/utils/get-user';
import { params } from '../../../../commons/express-joi/params';
import { $id } from '../../../../utils/id';
import { Members } from '../../../members/member';
import { isOrgMemberGuard } from '../../guards/is-org-member-guard';
import { orgExistsGuard } from '../../guards/org-exists-guard';
import { isAdminOrOwner } from '../../../../auth/guards/is-admin-or-owner';

const validators = [
  ...pageValidators,
  params(object({
    orgId: $id,
  })),
  query({
    search: {
      $schema: string().optional().empty('').min(3)
        .max(255),
    },
  }),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;
  const { search } = req.query;
  const pagination = getPagination(req);

  // find user teams in this org
  const user = getUser(req);
  const adminOrOwner = await isAdminOrOwner(user._id, orgId);
  const member = await Members().findOne({
    orgId,
    userId: user._id,
  });

  const teams = await Teams()
    .find(adminOrOwner ? {} : {
      members: member._id,
    })
    .project({ _id: 1 })
    .toArray();

  const dbQuery: FilterQuery<Site> = {
    teamId: {
      $in: teams.map(({ _id }) => _id),
    },
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
  ...orgExistsGuard,
  ...isOrgMemberGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
