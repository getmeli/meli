import { Org } from './org';

export function serializeOrg(org: Org) {
  return {
    _id: org._id,
    name: org.name,
    color: org.color,
  };
}
