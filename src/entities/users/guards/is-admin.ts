import { Members } from '../../members/member';

export async function isAdmin(userId: string, orgId: string) {
  const count = await Members().countDocuments({
    userId,
    orgId,
    admin: true,
  }, {
    limit: 1,
  });
  return count === 1;
}
