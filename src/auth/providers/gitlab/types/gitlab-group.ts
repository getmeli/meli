/* eslint-disable camelcase */

export interface GitlabGroup {
  id: number;
  web_url: string;
  name: string;
  path: string;
  description: string;
  visibility: string;
  share_with_group_lock: boolean;
  require_two_factor_authentication: boolean;
  two_factor_grace_period: number;
  project_creation_level: string;
  auto_devops_enabled?: any;
  subgroup_creation_level: string;
  emails_disabled?: any;
  mentions_disabled?: any;
  lfs_enabled: boolean;
  default_branch_protection: number;
  avatar_url?: any;
  request_access_enabled: boolean;
  full_name: string;
  full_path: string;
  created_at: Date;
  parent_id?: any;
}
