/* eslint-disable camelcase */

import axios, { AxiosInstance } from 'axios';
import {
  array, number, object, string,
} from 'joi';
import { GitlabUser } from './types/gitlab-user';
import { ensureStackTrace } from '../../../../commons/axios/ensure-stack-trace';
import { JOI_OPTIONS } from '../../../../constants';
import { GitlabGroup } from './types/gitlab-group';

const $user = object({
  id: number().required(),
  username: string().required(),
  email: string().required(),
});

const $orgs = array().required().items(object({
  path: string(),
}));

export class Gitlab {
  private axios: AxiosInstance;

  constructor(
    readonly token: string,
    private readonly url: string,
  ) {
    this.axios = axios.create({
      baseURL: this.url,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    ensureStackTrace(this.axios);
  }

  async getUser() {
    const [
      gitlabUser,
      { data: groups },
    ] = await Promise.all([
      this.getGitlabUser(),
      // https://docs.gitlab.com/ee/api/groups.html#list-groups
      this.axios.get<GitlabGroup[]>('/api/v4/groups'),
    ]);
    const gitlabGroups: GitlabGroup[] = await $orgs.validateAsync(groups, JOI_OPTIONS);
    return {
      id: gitlabUser.id,
      name: gitlabUser.username,
      email: gitlabUser.email,
      orgs: gitlabGroups.map(group => group.path),
    };
  }

  private async getGitlabUser(): Promise<GitlabUser> {
    // https://docs.gitlab.com/ee/api/users.html#list-current-user-for-normal-users
    const { data } = await this.axios.get<GitlabUser>('/api/v4/user');
    return $user.validateAsync(data, JOI_OPTIONS);
  }
}
