import { Members } from '../members/member';

export async function serializeProjectMember(memberId: string) {
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
