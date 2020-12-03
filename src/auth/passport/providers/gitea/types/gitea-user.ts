/* eslint-disable camelcase */

export interface GiteaUser {
  id: number;
  login: string;
  full_name: string;
  email: string;
  avatar_url: string;
  language: string;
  is_admin: boolean;
  last_login: Date;
  created: Date;
  username: string;
}
