import { axios } from '../../providers/axios';
import { Site } from './site';

export function getProjectSites(
  projectId: string,
): Promise<Site[]> {
  return axios
    .get(`/api/v1/projects/${projectId}/sites`)
    .then(res => res.data);
}
