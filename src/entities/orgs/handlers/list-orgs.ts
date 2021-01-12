import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { Orgs } from '../org';
import { getUser } from '../../../auth/utils/get-user';
import { serializeUserOrg } from '../serialize-user-org';
import { Members } from '../../members/member';

const validators = [];

async function handler(req: Request, res: Response): Promise<void> {
  const user = getUser(req);

  const members = await Members()
    .find({
      userId: user._id,
    })
    .toArray();

  const orgs = await Orgs()
    .find({
      $or: [
        {
          ownerId: user._id,
        },
        {
          _id: {
            $in: members.map(({ orgId }) => orgId),
          },
        },
      ],
    })
    .toArray();

  const json = await Promise.all(
    orgs.map(async org => {
      const member = members.find(m => m.orgId === org._id);
      return serializeUserOrg(org, member);
    }),
  );

  res.json(json);
}

export const listOrgs = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
