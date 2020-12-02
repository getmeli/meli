import { Members } from '../members/member';

export async function serializeTeamMember(memberId: string) {
  const member = await Members().findOne({
    _id: memberId,
  });
  return {
    memberId: member._id,
    name: member.name,
    email: member.email,
    admin: member.admin,
  };
}
