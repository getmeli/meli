import { inviteUrl } from './handlers/invites/add-invite';
import { Invite } from './invite';

export function serializeInvite(invite: Invite) {
  return {
    _id: invite._id,
    email: invite.email,
    expiresAt: invite.expiresAt,
    url: inviteUrl(invite),
    memberOptions: invite.memberOptions,
  };
}
