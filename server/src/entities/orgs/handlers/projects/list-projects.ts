import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { getUser } from '../../../../auth/utils/get-user';
import { Projects } from '../../../projects/project';
import { serializeProject } from '../../../projects/serialize-project';
import { isOrgMemberGuard } from '../../guards/is-org-member-guard';
import { params } from '../../../../commons/express-joi/params';
import { object } from 'joi';
import { orgExistsGuard } from '../../guards/org-exists-guard';
import { $id } from '../../../../utils/id';
import { Members } from '../../../members/member';
import { isAdminOrOwner } from '../../../../auth/guards/is-admin-or-owner';

const validators = [
  params(object({
    orgId: $id,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;
  const user = getUser(req);

  const member = await Members().findOne({
    orgId,
    userId: user._id,
  });

  const ownerOrAdmin = await isAdminOrOwner(user._id, orgId);

  const projects = await Projects()
    .find(ownerOrAdmin ? {
      orgId,
    } : {
      orgId,
      members: member._id,
    })
    .toArray();

  res.json(projects.map(serializeProject));
}

export const listProjects = [
  ...orgExistsGuard,
  ...isOrgMemberGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
