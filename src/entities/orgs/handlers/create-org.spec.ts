import { Collection } from 'mongodb';
import { testEnv } from '../../../../tests/test-env';
import { testServer } from '../../../../tests/test-server';
import * as _verifyToken from '../../../auth/utils/verify-token';
import * as _emitEvent from '../../../events/emit-event';
import { Member } from '../../members/member';
import * as _Members from '../../members/member';
import { Team } from '../../teams/team';
import * as _Teams from '../../teams/team';
import { User } from '../../users/user';
import * as _Users from '../../users/user';
import { Org } from '../org';
import * as _Orgs from '../org';

import request from 'supertest';

jest.mock('../../../env/env', () => ({ env: testEnv }));

describe('createOrg', () => {

  let app;

  beforeEach(async () => {
    // TODO spy server
    app = await testServer();
    jest.spyOn(_verifyToken, 'verifyToken').mockReturnValue(Promise.resolve({
      _id: 'authenticatedUserId',
      name: 'Authenticated User',
      email: 'authenticated@test.tst'
    } as User));
  });

  afterEach(() => jest.restoreAllMocks());

  it('should create org', async () => {
    const orgsInsertOne = jest.fn();
    const orgsCountDocuments = jest.fn().mockReturnValue(0);
    const membersInsertOne = jest.fn();
    const teamsInsertOne = jest.fn();

    jest.spyOn(_Orgs, 'Orgs').mockReturnValue({
      insertOne: orgsInsertOne,
      countDocuments: orgsCountDocuments,
    } as Partial<Collection<Org>> as Collection<Org>);
    jest.spyOn(_Members, 'Members').mockReturnValue({
      insertOne: membersInsertOne,
    } as Partial<Collection<Member>> as Collection<Member>);
    jest.spyOn(_Teams, 'Teams').mockReturnValue({
      insertOne: teamsInsertOne,
    } as Partial<Collection<Team>> as Collection<Team>);
    jest.spyOn(_Users, 'Users').mockReturnValue({
      findOne: async () => ({
        _id: 'authenticatedUserId',
        name: 'Tester',
        email: 'tester@test.tst',
      } as User),
    } as Partial<Collection<User>> as Collection<User>);
    jest.spyOn(_emitEvent, 'emitEvent').mockImplementation();

    const response = await request(app)
      .post('/api/v1/orgs')
      .set('Cookie', ['auth=testToken'])
      .send({
        name: 'Test Organization'
      });

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      member: {
        admin: true,
        owner: true,
      },
      org: {
        name: 'Test Organization',
      },
    });

    expect(orgsInsertOne).toHaveBeenCalledWith(expect.objectContaining({
      ownerId: 'authenticatedUserId',
      name: 'Test Organization',
    }));

    expect(membersInsertOne).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'authenticatedUserId',
      admin: true,
      name: 'Authenticated User',
      email: 'authenticated@test.tst'
    }));

    expect(teamsInsertOne).toHaveBeenCalled();
  });

});
