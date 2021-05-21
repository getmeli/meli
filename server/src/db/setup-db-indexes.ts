import { AppDb } from './db';
import { configureIndexes } from './indexes/configure-indexes';
import { Users } from '../entities/users/user';
import { Sites } from '../entities/sites/site';
import { Releases } from '../entities/releases/release';
import { Projects } from '../entities/projects/project';
import { Members } from '../entities/members/member';
import { ApiTokens } from '../entities/api/api-token';
import { HookDeliveries } from '../hooks/hook-delivery';
import { Hooks } from '../hooks/hook';
import { Orgs } from '../entities/orgs/org';

export async function setupDbIndexes() {
  await configureIndexes(AppDb.client, {
    [Orgs().collectionName]: [
      {
        fieldOrSpec: {
          'invites.token': 1,
        },
      },
    ],
    [Users().collectionName]: [
      {
        fieldOrSpec: {
          externalUserId: 1,
          authProvider: 1,
        },
        options: {
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          invalidateTokensAt: 1,
        },
      },
    ],
    [Sites().collectionName]: [
      {
        fieldOrSpec: {
          projectId: 1,
        },
      },
      {
        fieldOrSpec: {
          'branches._id': 1,
        },
        options: {
          unique: true,
          sparse: true,
        },
      },
      {
        fieldOrSpec: {
          _id: 1,
          'branches.name': 1,
        },
        options: {
          unique: true,
          sparse: true,
        },
      },
      {
        fieldOrSpec: {
          _id: 1,
          'branches.slug': 1,
        },
        options: {
          unique: true,
          sparse: true,
        },
      },
      {
        fieldOrSpec: {
          'branches._id': 1,
          'branches.redirect.path': 1,
        },
        options: {
          unique: true,
          sparse: true,
        },
      },
      {
        fieldOrSpec: {
          'tokens._id': 1,
        },
        options: {
          unique: true,
          sparse: true,
        },
      },
      {
        fieldOrSpec: {
          'tokens.value': 1,
        },
        options: {
          unique: true,
          sparse: true,
        },
      },
      {
        fieldOrSpec: {
          name: 1,
        },
        options: {
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          name: 'text',
        },
        options: {
          name: 'text',
        },
      },
    ],
    [Releases().collectionName]: [
      {
        fieldOrSpec: {
          siteId: 1,
        },
      },
      {
        fieldOrSpec: {
          branches: 1,
        },
      },
      {
        fieldOrSpec: {
          name: 'text',
          branches: 'text',
        },
      },
    ],
    [Projects().collectionName]: [
      {
        fieldOrSpec: {
          members: 1,
        },
      },
      {
        fieldOrSpec: {
          name: 'text',
        },
      },
    ],
    [Members().collectionName]: [
      {
        fieldOrSpec: {
          userId: 1,
          orgId: 1,
        },
        options: {
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          name: 'text',
          email: 'text',
        },
      },
    ],
    [ApiTokens().collectionName]: [
      {
        fieldOrSpec: {
          value: 1,
        },
        options: {
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          name: 'text',
        },
      },
      {
        fieldOrSpec: {
          activatesAt: 1,
        },
      },
      {
        fieldOrSpec: {
          expiresAt: 1,
        },
      },
    ],
    [Hooks().collectionName]: [],
    [HookDeliveries().collectionName]: [
      {
        fieldOrSpec: {
          hookId: 1,
        },
      },
      {
        fieldOrSpec: {
          date: 1,
        },
      },
    ],
  });
}
