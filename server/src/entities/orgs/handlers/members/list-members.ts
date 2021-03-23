import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { $id } from '../../../../utils/id';
import { serializeMember } from '../../../members/serialize-member';
import { params } from '../../../../commons/express-joi/params';
import { object } from 'joi';
import { getPagination, pageResponse, pageValidators } from '../../../../utils/get-pagination';
import { FilterQuery } from 'mongodb';
import { Member, Members } from '../../../members/member';
import { Orgs } from '../../org';
import { isAdminOrOwnerGuard } from '../../../../auth/guards/is-admin-or-owner-guard';
import { orgExistsGuard } from '../../guards/org-exists-guard';

const validators = [
  ...pageValidators,
  params(object({
    orgId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const pagination = getPagination(req);
  const { orgId } = req.params;

  const dbQuery: FilterQuery<Member> = {
    orgId,
    ...(
      req.query.search
        ? {
          $text: {
            $search: req.query.search,
          },
        }
        : undefined as any
    ),
  };

  const count = await Members()
    .find(dbQuery)
    .count();

  const members = await Members()
    .find(dbQuery)
    .skip(pagination.offset)
    .limit(pagination.size)
    .toArray();

  const org = await Orgs().findOne({
    _id: orgId,
  });

  const json = await Promise.all(members.map(member => serializeMember(member, org.ownerId)));
  res.json(pageResponse(json, count));
}

export const listMembers = [
  ...orgExistsGuard,
  ...isAdminOrOwnerGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
