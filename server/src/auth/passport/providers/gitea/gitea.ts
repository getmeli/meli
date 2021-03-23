/* eslint-disable camelcase */

import axios, { AxiosInstance } from 'axios';
import {
  array, number, object, string,
} from 'joi';
import { GiteaUser } from './types/gitea-user';
import { ensureStackTrace } from '../../../../commons/axios/ensure-stack-trace';
import { JOI_OPTIONS } from '../../../../constants';
import { GiteaOrg } from './types/gitea-org';

const $user = object({
  id: number().required(),
  login: string().required(),
  email: string().required(),
});

const $orgs = array().required().items(object({
  username: string(),
}));

export class Gitea {
  private axios: AxiosInstance;

  constructor(
    readonly token: string,
    private readonly url: string,
  ) {
    this.axios = axios.create({
      baseURL: this.url,
      headers: {
        Authorization: `bearer ${this.token}`,
      },
    });
    ensureStackTrace(this.axios);
  }

  async getUser() {
    const [
      { data: user },
      { data: orgs },
    ] = await Promise.all([
      // https://try.gitea.io/api/swagger#/user/userGetCurrent
      this.axios.get<GiteaUser>('/api/v1/user'),
      // https://try.gitea.io/api/swagger#/organization/orgGetAll
      this.axios.get<GiteaOrg[]>('/api/v1/orgs'),
    ]);
    const giteaUser: GiteaUser = await $user.validateAsync(user, JOI_OPTIONS);
    const giteaOrgs: GiteaOrg[] = await $orgs.validateAsync(orgs, JOI_OPTIONS);
    return {
      id: giteaUser.id,
      name: giteaUser.login,
      email: giteaUser.email,
      orgs: giteaOrgs.map(org => org.username),
    };
  }
}
