import { isOwner } from './is-owner';
import { isAdmin } from './is-admin';

export async function isAdminOrOwner(userId: string, orgId: string): Promise<boolean> {
  const admin = await isAdmin(userId, orgId);
  if (admin) {
    return true;
  }
  return isOwner(userId, orgId);
}
