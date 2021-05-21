import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { projectExistsGuard } from '../../guards/project-exists-guard';
import { object } from 'joi';
import { Projects } from '../../project';
import { $id } from '../../../../utils/id';
import { emitEvent } from '../../../../events/emit-event';
import { params } from '../../../../commons/express-joi/params';
import { BadRequestError } from '../../../../commons/errors/bad-request-error';
import { canAdminProjectGuard } from '../../guards/can-admin-project-guard';
import { EventType } from '../../../../events/event-type';
import { Members } from '../../../members/member';
import { Orgs } from '../../../orgs/org';
import { NotFoundError } from '../../../../commons/errors/not-found-error';
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
    throw new NotFoundError('No such member');
  }

  const { matchedCount } = await Projects().updateOne({
    _id: projectId,
  }, {
    $pull: {
      members: memberId,
    },
  });

  if (matchedCount === 0) {
    throw new BadRequestError('Not a project member');
  }

  emitEvent(EventType.project_member_deleted, {
    org,
    project,
    member,
  });
  res.status(204).send();
}

export const deleteMember = [
  ...projectExistsGuard,
  ...canAdminProjectGuard,
  ...orgMemberExistsGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
