import { Org } from './org';
import { env } from '../../env/env';

export function serializeOrg(org: Org) {
  return {
    _id: org._id,
    name: org.name,
    color: org.color,
    // ?id=... forces cache refresh
    logo: org.logo ? `${env.MELI_URL}/api/v1/orgs/${org._id}/logo?id=${org.logo.id}` : undefined,
  };
}
