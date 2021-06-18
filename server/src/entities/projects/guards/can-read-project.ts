import { Projects } from '../project';
import { AppError } from '../../../commons/errors/app-error';
import { isAdminOrOwner } from '../../../auth/guards/is-admin-or-owner';
import { Members } from '../../members/member';

export async function canReadProject(projectId: string, userId: string): Promise<boolean> {
  const project = await Projects().findOne({
    _id: (projectId),
  });

  if (!project) {
    throw new AppError('Project not found');
  }

  const { orgId, members } = project;

  if (await isAdminOrOwner(userId, orgId)) {
    return true;
  }

  const member = await Members().findOne({
    userId,
    orgId,
  });

  if (!member) {
    throw new Error('Not an organization member');
  }

  return members.includes(member._id);
}
