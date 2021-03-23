import { axios } from '../../providers/axios';
import { Env } from '../../providers/EnvProvider';
import { Site } from './site';

export function getTeamSites(
  env: Env,
  teamId: string,
): Promise<Site[]> {
  return axios
    .get(`${env.MELI_API_URL}/api/v1/teams/${teamId}/sites`)
    .then(res => res.data);
}
