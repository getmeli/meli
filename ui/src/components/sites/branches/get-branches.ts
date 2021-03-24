import { axios } from '../../../providers/axios';
import { Env } from '../../../providers/EnvProvider';
import { Branch } from './branch';

export function getBranches(
  env: Env,
  siteId: string,
): Promise<Branch[]> {
  return axios
    .get(`/api/v1/sites/${siteId}/branches`)
    .then(res => res.data);
}
