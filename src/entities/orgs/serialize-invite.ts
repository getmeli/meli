import { Invite } from './invite';

export function serializeInvite(invite: Invite) {
  return {
    _id: invite._id,
    email: invite.email,
    expiresAt: invite.expiresAt,
    memberOptions: invite.memberOptions,
  };
}
