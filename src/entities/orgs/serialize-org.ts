import { Org } from './org';
import { getLogoUrl } from '../../utils/get-logo-url';

export function serializeOrg(org: Org) {
  return {
    _id: org._id,
    name: org.name,
    color: org.color,
    logo: getLogoUrl('orgs', org),
  };
}
