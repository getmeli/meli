import { axios } from '../../../../providers/axios';
import { Env } from '../../../../providers/EnvProvider';
import { Page } from '../../../../commons/types/page';
import { OrgMember } from './org-member';

export interface OrgMembersSearchQuery {
  search: string;
  page: number;
  size: number;
}

export function getMembers(
  env: Env,
  orgId: string,
  query?: OrgMembersSearchQuery,
): Promise<Page<OrgMember>> {
  return axios
    .get(`${env.MELI_API_URL}/api/v1/orgs/${orgId}/members`, {
      params: {
        ...query,
      },
    })
    .then(res => res.data);
}
