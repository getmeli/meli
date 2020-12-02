import { isOwner } from '../../entities/users/guards/is-owner';
import { isAdmin } from '../../entities/users/guards/is-admin';

export async function isAdminOrOwner(userId: string, orgId: string): Promise<boolean> {
  const admin = await isAdmin(userId, orgId);
  if (admin) {
    return true;
  }
  return isOwner(userId, orgId);
}
