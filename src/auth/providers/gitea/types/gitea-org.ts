/* eslint-disable camelcase */

export interface GiteaOrg {
  id: number;
  username: string;
  full_name: string;
  avatar_url: string;
  description: string;
  website: string;
  location: string;
  visibility: string;
  repo_admin_change_team_access: boolean;
}
