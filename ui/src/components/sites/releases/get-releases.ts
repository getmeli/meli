import { axios } from '../../../providers/axios';
import { Page } from '../../../commons/types/page';
import { Release } from './release';

export interface ReleaseSearchQuery {
  search: string;
  page: number;
  size: number;
  branch?: string;
}

export function getReleases(
  siteId: string,
  query?: ReleaseSearchQuery,
): Promise<Page<Release>> {
  return axios
    .get(`/api/v1/sites/${siteId}/releases`, {
      params: {
        ...query,
        search: query.search || undefined,
      },
    })
    .then(res => res.data);
}
