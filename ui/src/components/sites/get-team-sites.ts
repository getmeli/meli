import { axios } from '../../providers/axios';
import { Site } from './site';

export function getTeamSites(
  teamId: string,
): Promise<Site[]> {
  return axios
    .get(`/api/v1/teams/${teamId}/sites`)
    .then(res => res.data);
}
