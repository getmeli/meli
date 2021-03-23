import { Members } from '../../members/member';

export async function isOrgMember(userId: string, orgId: string) {
  const count = await Members().countDocuments({
    userId,
    orgId,
  }, {
    limit: 1,
  });
  return count === 1;
}
