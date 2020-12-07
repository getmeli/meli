import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { Org, Orgs } from '../org';
import randomColor from 'randomcolor';
import { emitEvent } from '../../../events/emit-event';
import { Member, Members } from '../../members/member';
import { Team, Teams } from '../../teams/team';
import { getUser } from '../../../auth/utils/get-user';
import { body } from '../../../commons/express-joi/body';
import { object, string } from 'joi';
import { uuid } from '../../../utils/uuid';
import { serializeUserOrg } from '../serialize-user-org';
import { EventType } from '../../../events/event-type';
import { maxOrgsGuard } from '../guards/max-org-guard';

const validators = [
  body(object({
    name: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const user = getUser(req);

  // create org
  const org: Org = {
    _id: uuid(),
    color: randomColor(),
    ownerId: user._id,
    name: req.body.name,
    createdAt: new Date(),
    updatedAt: new Date(),
    invites: [],
    hooks: [],
  };
  await Orgs().insertOne(org);
  emitEvent(EventType.user_org_created, {
    org,
    user,
  });

  // assign user org
  const member: Member = {
    _id: uuid(),
    userId: user._id,
    orgId: org._id,
    admin: true,
    name: user.name,
    email: user.email,
  };
  await Members().insertOne(member);
  emitEvent(EventType.org_member_joined, {
    org,
    member,
  });

  // create first team
  const team: Team = {
    _id: uuid(),
    orgId: org._id,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Team 1',
    color: randomColor(),
    members: [
      member._id,
    ],
    hooks: [],
  };
  await Teams().insertOne(team);
  emitEvent(EventType.org_team_added, {
    org,
    team,
  });

  res.json(serializeUserOrg(org, member));
}

export const createOrg = [
  ...validators,
  maxOrgsGuard,
  wrapAsyncMiddleware(handler),
];
