import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { Orgs } from '../../orgs/org';
import { object, string } from 'joi';
import { serializeUserInvite } from '../serialize-invite';
import { params } from '../../../commons/express-joi/params';
import { NotFoundError } from '../../../commons/errors/not-found-error';

const validators = [
  params(object({
    token: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { token } = req.params;

  // tokens should never collide (shall you get a collision, I'll buy a lottery ticket)
  const org = await Orgs().findOne({
    'invites.token': token,
  });

  if (!org) {
    throw new NotFoundError('Invite not found');
  }

  const invite = org.invites.find(inv => inv.token === token);

  res.json(serializeUserInvite(org, invite));
}

export const getInvite = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
