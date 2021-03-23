import { axios } from '../../../providers/axios';
import { Env } from '../../../providers/EnvProvider';
import { Page } from '../../../commons/types/page';
import { TeamMember } from './team-member';

export function getMembers(
  env: Env,
  teamId: string,
  search?: string,
): Promise<Page<TeamMember>> {
  return axios
    .get(`${env.MELI_API_URL}/api/v1/teams/${teamId}/members`, {
      params: {
        search: search || undefined,
      },
    })
    .then(res => res.data);
}
