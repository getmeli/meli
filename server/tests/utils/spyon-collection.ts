import { Collection } from 'mongodb';
import * as _ApiTokens from '../../src/entities/api/api-token';
import * as _Members from '../../src/entities/members/member';
import * as _Orgs from '../../src/entities/orgs/org';
import * as _Sites from '../../src/entities/sites/site';
import * as _Projects from '../../src/entities/projects/project';
import * as _Users from '../../src/entities/users/user';
import * as _Releases from '../../src/entities/releases/release';

// In order to be able to use spyOnCollection with a collection, you must import its module here and add it
// to the TEST_COLLECTIONS constant.

const TEST_COLLECTIONS = {
  ApiTokens: _ApiTokens,
  Members: _Members,
  Orgs: _Orgs,
  Sites: _Sites,
  Projects: _Projects,
  Users: _Users,
  Releases: _Releases,
};

type TestCollections = typeof TEST_COLLECTIONS;

export function spyOnCollection<M, N extends keyof TestCollections>(collectionName: N, methods: Partial<Collection<M>>) {
  jest.spyOn(TEST_COLLECTIONS[collectionName], collectionName as any).mockReturnValue({
    ...methods,
  } as any);

  return methods;
}
