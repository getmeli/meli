import { Org } from './org';
import { Member } from '../members/member';
import { serializeOrg } from './serialize-org';
import { serializeMember } from '../members/serialize-member';

export async function serializeUserOrg(org: Org, member: Member) {
  return {
    org: serializeOrg(org),
    member: await serializeMember(member, org.ownerId),
  };
}
