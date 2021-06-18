// TODO use react contexts ?

export enum AppEvent {
  // orgs
  org_created = 'org_created',
  org_updated = 'org_updated',
  org_member_added = 'org_member_added',
  org_member_updated = 'org_member_updated',
  org_member_deleted = 'org_member_deleted',
  // projects
  project_added = 'project_added',
  project_updated = 'project_updated',
  project_deleted = 'project_deleted',
  project_member_added = 'project_member_added',
  project_member_deleted = 'project_member_deleted',
  // sites
  site_added = 'site_added',
  site_updated = 'site_updated',
  site_release_set = 'site_release_set',
  site_deleted = 'site_deleted',
  // tokens
  token_added = 'token_added',
  token_deleted = 'token_deleted',
  // branches
  branch_updated = 'branch_updated',
  branch_added = 'branch_added',
  branch_deleted = 'branch_deleted',
  // TODO might want to merge both of these events / methods
  branch_release_unset = 'branch_release_unset',
  branch_release_updated = 'branch_release_updated',
  // releases
  release_created = 'release_created',
  release_renamed = 'release_renamed',
  release_deleted = 'release_deleted',
}
