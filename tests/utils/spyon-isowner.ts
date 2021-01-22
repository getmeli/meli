import * as _isOwner from '../../src/entities/users/guards/is-owner';

export function spyOnIsOwner(value: boolean, requiredUserId?: string, requiredOrgId?: string) {
  return jest.spyOn(_isOwner, 'isOwner').mockImplementation(async (userId, orgId) => {
    if (requiredUserId !== undefined && userId !== requiredUserId) {
      return false;
    }

    if (requiredOrgId !== undefined && orgId !== requiredOrgId) {
      return false;
    }

    return value;
  });
}
