import { canReadProject } from '../../projects/guards/can-read-project';
import { Sites } from '../site';
import { NotFoundError } from '../../../commons/errors/not-found-error';

export async function canAdminSite(siteId: string, userId: string): Promise<boolean> {
  const site = await Sites().findOne({
    _id: siteId,
  });

  if (!site) {
    throw new NotFoundError('Site not found');
  }

  return canReadProject(site.projectId, userId);
}
