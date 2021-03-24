import { axios } from '../../../../providers/axios';
import { Page } from '../../../../commons/types/page';
import { OrgMember } from './org-member';

export interface OrgMembersSearchQuery {
  search: string;
  page: number;
  size: number;
}

export function getMembers(
  orgId: string,
  query?: OrgMembersSearchQuery,
): Promise<Page<OrgMember>> {
  return axios
    .get(`/api/v1/orgs/${orgId}/members`, {
      params: {
        ...query,
      },
    })
    .then(res => res.data);
}
