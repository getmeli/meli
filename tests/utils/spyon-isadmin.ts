import * as _isAdmin from '../../src/auth/guards/is-admin';

export function spyOnIsAdmin(value: boolean, requiredUserId?: string, requiredOrgId?: string) {
  return jest.spyOn(_isAdmin, 'isAdmin').mockImplementation(async (userId, orgId) => {
    if (requiredUserId !== undefined && userId !== requiredUserId) {
      return false;
    }

    if (requiredOrgId !== undefined && orgId !== requiredOrgId) {
      return false;
    }

    return value;
  });
}
