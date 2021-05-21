import { axios } from '../../../providers/axios';
import { Env } from '../../../providers/EnvProvider';
import { Page } from '../../../commons/types/page';
import { ProjectMember } from './project-member';

export function getMembers(
  env: Env,
  projectId: string,
  search?: string,
): Promise<Page<ProjectMember>> {
  return axios
    .get(`/api/v1/projects/${projectId}/members`, {
      params: {
        search: search || undefined,
      },
    })
    .then(res => res.data);
}
