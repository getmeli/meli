import { Org } from '../orgs/org';
import { Invite } from '../orgs/invite';
import { getLogoUrl } from '../../utils/get-logo-url';

export function serializeUserInvite(org: Org, invite: Invite) {
  return {
    _id: invite._id,
    org: {
      name: org.name,
      color: org.color,
      logo: getLogoUrl('orgs', org, { invite: invite.token }),
    },
    expiresAt: invite.expiresAt,
    memberOptions: invite.memberOptions,
  };
}
