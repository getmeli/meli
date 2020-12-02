/* eslint-disable camelcase */

export interface Identity {
  provider: string;
  extern_uid: string;
}

export interface GitlabUser {
  id: number;
  name: string;
  username: string;
  state: string;
  avatar_url: string;
  web_url: string;
  created_at: Date;
  bio: string;
  bio_html: string;
  location?: any;
  public_email: string;
  skype: string;
  linkedin: string;
  twitter: string;
  website_url: string;
  organization?: any;
  job_title: string;
  work_information?: any;
  last_sign_in_at: Date;
  confirmed_at: Date;
  last_activity_on: string;
  email: string;
  theme_id: number;
  color_scheme_id: number;
  projects_limit: number;
  current_sign_in_at: Date;
  identities: Identity[];
  can_create_group: boolean;
  can_create_project: boolean;
  two_factor_enabled: boolean;
  external: boolean;
  private_profile: boolean;
  is_admin: boolean;
  note: string;
}
