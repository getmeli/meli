import { AppDb } from './db';
import { configureIndexes } from './indexes/configure-indexes';
import { Users } from '../entities/users/user';
import { Sites } from '../entities/sites/site';
import { Releases } from '../entities/releases/release';
import { Teams } from '../entities/teams/team';
import { Members } from '../entities/members/member';
import { ApiTokens } from '../entities/api/api-token';
import { HookDeliveries } from '../hooks/hook-delivery';

export async function setupDbIndexes() {
  await configureIndexes(AppDb.client, {
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
      {
        fieldOrSpec: {
          hooks: 1,
        },
        options: {
          unique: true,
        },
      },
    ],
    [Sites().collectionName]: [
      {
        fieldOrSpec: {
          team: 1,
        },
      },
      {
        fieldOrSpec: {
          siteId: 1,
          'branches._id': 1,
        },
        options: {
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          siteId: 1,
          'branches.name': 1,
        },
        options: {
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          siteId: 1,
          'branches.slug': 1,
        },
        options: {
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          'branches._id': 1,
        },
        options: {
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          'branches._id': 1,
          'branches.redirect.path': 1,
        },
        options: {
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          'tokens._id': 1,
        },
        options: {
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          'tokens.value': 1,
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
          unique: true,
        },
      },
      {
        fieldOrSpec: {
          hooks: 1,
        },
        options: {
          unique: true,
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
    [Teams().collectionName]: [
      {
        fieldOrSpec: {
          members: 1,
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
          hooks: 1,
        },
        options: {
          unique: true,
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
