import { axios } from '../../../providers/axios';
import { Env } from '../../../providers/EnvProvider';
import { Page } from '../../../commons/types/page';
import { Release } from './release';

export interface ReleaseSearchQuery {
  search: string;
  page: number;
  size: number;
  branch?: string;
}

export function getReleases(
  env: Env,
  siteId: string,
  query?: ReleaseSearchQuery,
): Promise<Page<Release>> {
  return axios
    .get(`${env.MELI_API_URL}/api/v1/sites/${siteId}/releases`, {
      params: {
        ...query,
        search: query.search || undefined,
      },
    })
    .then(res => res.data);
}
