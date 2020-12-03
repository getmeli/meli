import axios, { AxiosInstance } from 'axios';
import {
  array, boolean, number, object, string,
} from 'joi';
import { GithubUser } from './types/github-user';
import { ensureStackTrace } from '../../../../commons/axios/ensure-stack-trace';
import { JOI_OPTIONS } from '../../../../constants';
import { GithubEmail } from './types/github-email';
import { GithubOrg } from './types/github-org';

const $user = object({
  id: number().required(),
  login: string().required(),
});

const $orgs = array().required().items(object({
  login: string(),
}));

const $emails = array()
  .min(1)
  .items(object({
    email: string().required(),
    primary: boolean().required(),
  }));

export class Github {
  private axios: AxiosInstance;

  constructor(
    readonly token: string,
    private readonly url: string,
  ) {
    this.axios = axios.create({
      baseURL: this.url === 'https://github.com' ? 'https://api.github.com' : `${url}/api/v3`,
      headers: {
        Authorization: `token ${this.token}`,
        // https://developer.github.com/v3/#current-version
        // Accept: 'application/vnd.github.v3+json',
      },
    });

    ensureStackTrace(this.axios);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUser() {
    const [
      { data: user },
      { data: orgs },
      { data: emails },
    ] = await Promise.all([
      // https://developer.github.com/v3/users/#get-the-authenticated-user
      this.axios.get<GithubUser>('/user'),
      // https://developer.github.com/v3/orgs/#list-organizations-for-the-authenticated-user
      this.axios.get<GithubOrg[]>('/user/orgs'),
      // https://developer.github.com/v3/users/emails/#list-email-addresses-for-the-authenticated-user
      this.axios.get<GithubEmail[]>('/user/emails'),
    ]);
    const giteaUser: GithubUser = await $user.validateAsync(user, JOI_OPTIONS);
    const githubOrgs: GithubOrg[] = await $orgs.validateAsync(orgs, JOI_OPTIONS);
    console.log(orgs, githubOrgs);
    const githubEmails: GithubEmail[] = await $emails.validateAsync(emails, JOI_OPTIONS);
    return {
      id: giteaUser.id,
      name: giteaUser.login,
      email: (githubEmails.find(({ primary }) => primary)?.email || githubEmails[0].email),
      orgs: githubOrgs.map(org => org.login),
    };
  }
}
