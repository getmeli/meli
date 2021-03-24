import { axios } from '../../../providers/axios';
import { Env } from '../../../providers/EnvProvider';
import { Page } from '../../../commons/types/page';
import { Token } from './token';

export function getTokens(
  env: Env,
  siteId: string,
  search?: string,
): Promise<Page<Token>> {
  return axios
    .get(`/api/v1/sites/${siteId}/tokens`, {
      params: {
        search: search || undefined,
      },
    })
    .then(res => res.data);
}
