import { Users } from '../users/user';
import { Member } from './member';

export async function serializeMember(member: Member, ownerId: string) {
  const user = await Users().findOne({
    _id: member.userId,
  });
  return {
    _id: member._id,
    name: user.name,
    email: user.email,
    admin: member.admin,
    owner: user._id === ownerId,
  };
}
