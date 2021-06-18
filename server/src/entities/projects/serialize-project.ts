import { Project } from './project';
import { getLogoUrl } from '../../utils/get-logo-url';

export function serializeProject(project: Project) {
  return {
    _id: project._id,
    orgId: project.orgId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    name: project.name,
    color: project.color,
    logo: getLogoUrl('projects', project),
  };
}
