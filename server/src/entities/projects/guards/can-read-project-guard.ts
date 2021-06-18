import { guard } from '../../../commons/express/guard';
import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { getUser } from '../../../auth/utils/get-user';
import { canReadProject } from './can-read-project';
import { $id } from '../../../utils/id';

export const canReadProjectGuard = [
  params(object({
    projectId: $id,
  })),
  guard(req => {
    const user = getUser(req);
    const { projectId } = req.params;
    return canReadProject(projectId, user._id);
  }, 'Cannot get project'),
];
