import { Orgs } from '../../orgs/org';

export async function isOwner(userId: string, orgId: string) {
  const count = await Orgs().countDocuments({
    _id: orgId,
    ownerId: userId,
  }, {
    limit: 1,
  });
  return count === 1;
}
