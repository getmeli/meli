import { isAdminOrOwner } from './is-admin-or-owner';
import * as _isAdmin from './is-admin';
import * as _isOwner from './is-owner';

describe('isAdminOrOwner', () => {

  afterEach(() => jest.restoreAllMocks());

  it('should be true when user is admin', async () => {
    const isAdmin = jest.spyOn(_isAdmin, 'isAdmin').mockReturnValue(Promise.resolve(true));
    const isOwner = jest.spyOn(_isOwner, 'isOwner').mockReturnValue(Promise.resolve(false));

    const adminOrOwner = await isAdminOrOwner('userId', 'orgId');

    expect(adminOrOwner).toEqual(true);
    expect(isAdmin).toHaveBeenCalledWith('userId', 'orgId');
    expect(isOwner).not.toHaveBeenCalled();
  });

  it('should be true when user is owner', async () => {
    jest.spyOn(_isAdmin, 'isAdmin').mockReturnValue(Promise.resolve(false));
    const isOwner = jest.spyOn(_isOwner, 'isOwner').mockReturnValue(Promise.resolve(true));

    const adminOrOwner = await isAdminOrOwner('userId', 'orgId');

    expect(adminOrOwner).toEqual(true);
    expect(isOwner).toHaveBeenCalledWith('userId', 'orgId');
  });

  it('should be false when user is admin neither admin nor user', async () => {
    const isAdmin = jest.spyOn(_isAdmin, 'isAdmin').mockReturnValue(Promise.resolve(false));
    const isOwner = jest.spyOn(_isOwner, 'isOwner').mockReturnValue(Promise.resolve(false));

    const adminOrOwner = await isAdminOrOwner('userId', 'orgId');

    expect(adminOrOwner).toEqual(false);
  });

});
