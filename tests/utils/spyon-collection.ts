import { Collection } from 'mongodb';
import * as _Members from '../../src/entities/members/member';
import * as _Orgs from '../../src/entities/orgs/org';
import * as _Teams from '../../src/entities/teams/team';
import * as _Users from '../../src/entities/users/user';

// In order to be able to use spyOnCollection with a collection, you must import its module here and add it
// to the TEST_COLLECTIONS constant.

const TEST_COLLECTIONS = {
  Members: _Members,
  Orgs: _Orgs,
  Teams: _Teams,
  Users: _Users,
};

type TestCollections = typeof TEST_COLLECTIONS;

export function spyOnCollection<M, N extends keyof TestCollections>(collectionName: N, methods: Partial<Collection<M>>) {
  jest.spyOn(TEST_COLLECTIONS[collectionName], collectionName as any).mockReturnValue({
    ...methods,
  } as any);

  return methods;
}
