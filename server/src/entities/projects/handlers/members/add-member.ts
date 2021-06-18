import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { projectExistsGuard } from '../../guards/project-exists-guard';
import { object } from 'joi';
import { Projects } from '../../project';
import { $id } from '../../../../utils/id';
import { emitEvent } from '../../../../events/emit-event';
import { BadRequestError } from '../../../../commons/errors/bad-request-error';
import { serializeProjectMember } from '../../serialize-project-member';
import { NotFoundError } from '../../../../commons/errors/not-found-error';
import { params } from '../../../../commons/express-joi/params';
import { Members } from '../../../members/member';
import { canAdminProjectGuard } from '../../guards/can-admin-project-guard';
import { EventType } from '../../../../events/event-type';
import { Orgs } from '../../../orgs/org';
import { orgMemberExistsGuard } from '../../guards/org-member-exists-guard';

const validators = [
  params(object({
    projectId: $id,
    memberId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { projectId, memberId } = req.params;

  const project = await Projects().findOne({ _id: projectId });
  const org = await Orgs().findOne({ _id: project.orgId });
  const member = await Members().findOne({ _id: memberId });

  if (!member) {
    throw new NotFoundError('Org member not found');
  }

  const { matchedCount } = await Projects().updateOne({
    _id: projectId,
    members: {
      $ne: memberId,
    },
  }, {
    $addToSet: {
      members: memberId,
    },
  });

  if (matchedCount === 0) {
    throw new BadRequestError('User already member of project');
  }

  emitEvent(EventType.project_member_added, {
    org,
    project,
    member,
  });
  res.json(await serializeProjectMember(memberId));
}

export const addMember = [
  ...projectExistsGuard,
  ...canAdminProjectGuard,
  ...orgMemberExistsGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
