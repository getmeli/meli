import { Org } from '../orgs/org';
import { Invite } from '../orgs/invite';

export function serializeUserInvite(org: Org, invite: Invite) {
  return {
    _id: invite._id,
    org: {
      name: org.name,
      color: org.color,
    },
    expiresAt: invite.expiresAt,
    memberOptions: invite.memberOptions,
  };
}
