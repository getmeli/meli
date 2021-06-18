import { Org } from '../entities/orgs/org';
import { Service } from '../entities/services/service';
import { EventType } from './event-type';
import { User } from '../entities/users/user';
import { Project } from '../entities/projects/project';
import { Site, SiteToken } from '../entities/sites/site';
import { Hook } from '../hooks/hook';
import { ApiToken } from '../entities/api/api-token';
import { Invite } from '../entities/orgs/invite';
import { Member } from '../entities/members/member';
import { Release } from '../entities/releases/release';
import { Branch } from '../entities/sites/branch';
import { Form } from '../entities/forms/form';

export interface UserEventData {
  user: User;
}

export interface OrgEventData {
  org: Org;
}

export interface ProjectEventData {
  project: Project;
}

export interface SiteEventData {
  site: Site;
}

export interface UserApiTokenCreatedEventData extends UserEventData {
  apiToken: ApiToken;
}

export interface UserApiTokenUpdatedEventData extends UserEventData {
  apiToken: ApiToken;
}

export interface UserApiTokenDeletedEventData extends UserEventData {
  apiToken: ApiToken;
}

export interface UserOrgCreatedEventData extends UserEventData {
  org: Org;
}

export interface OrgUpdatedEventData extends OrgEventData {
  org: Org;
}

export interface OrgInviteAddedEventData extends OrgEventData {
  invite: Invite;
}

export interface OrgInviteDeletedEventData extends OrgEventData {
  invite: Invite;
}

export interface OrgInviteAcceptedEventData extends OrgEventData {
  invite: Invite;
}

export interface OrgInviteDeclinedEventData extends OrgEventData {
  invite: Invite;
}

export interface OrgMemberJoinedEventData extends OrgEventData {
  member: Member;
}

export interface OrgMemberUpdatedEventData extends OrgEventData {
  member: Member;
}

export interface OrgMemberDeletedEventData extends OrgEventData {
  member: Member;
}

export interface OrgHookCreatedEventData extends OrgEventData {
  hook: Hook;
}

export interface OrgHookUpdatedEventData extends OrgEventData {
  hook: Hook;
}

export interface OrgHookDeletedEventData extends OrgEventData {
  hook: Hook;
}

export interface OrgProjectAddedEventData extends OrgEventData {
  project: Project;
}

export type ProjectUpdatedEventData = ProjectEventData

export type ProjectDeletedEventData = ProjectEventData

export interface ProjectMemberAddedEventData extends ProjectEventData {
  org: Org;
  project: Project;
  member: Member;
}

export interface ProjectMemberDeletedEventData extends ProjectEventData {
  org: Org;
  project: Project;
  member: Member;
}

export interface ProjectHookCreatedEventData extends ProjectEventData {
  hook: Hook;
}

export interface ProjectHookUpdatedEventData extends ProjectEventData {
  hook: Hook;
}

export interface ProjectHookDeletedEventData extends ProjectEventData {
  hook: Hook;
}

export interface ProjectSiteAddedEventData extends ProjectEventData {
  site: Site;
}

export interface SiteUpdatedEventData extends SiteEventData {
  site: Site;
}

export interface SitePasswordSetEventData extends SiteEventData {
  site: Site;
}

export interface SitePasswordRemovedEventData extends SiteEventData {
  site: Site;
}

export type SiteDeletedEventData = SiteEventData

export interface SiteHookCreatedEventData extends SiteEventData {
  hook: Hook;
}

export interface SiteHookUpdatedEventData extends SiteEventData {
  hook: Hook;
}

export interface SiteHookDeletedEventData extends SiteEventData {
  hook: Hook;
}

export interface SiteTokenAddedEventData extends SiteEventData {
  token: SiteToken;
}

export interface SiteTokenDeletedEventData extends SiteEventData {
  token: SiteToken;
}

export interface SiteReleaseCreatedEventData extends SiteEventData {
  release: Release;
}

export interface SiteReleaseRenamedEventData extends SiteEventData {
  release: Release;
}

export interface SiteReleaseDeletedEventData extends SiteEventData {
  release: Release;
}

export interface SiteBranchAddedEventData extends SiteEventData {
  branch: Branch;
}

export interface SiteBranchUpdatedEventData extends SiteEventData {
  branch: Branch;
}

export interface SiteBranchDeletedEventData extends SiteEventData {
  branch: Branch;
}

export interface SiteBranchReleaseSetEventData extends SiteEventData {
  branch: Branch;
  release: Release;
}

export interface SiteBranchPasswordSetEventData extends SiteEventData {
  branch: Branch;
}

export interface SiteBranchPasswordRemovedEventData extends SiteEventData {
  branch: Branch;
}

export interface SiteBranchRedirectsSetEventData extends SiteEventData {
  branch: Branch;
}

export interface ProjectServiceAddedEventData extends ProjectEventData {
  service: Service;
}

export interface FormEvent {
  form: Form;
}

export interface EventData {
  [EventType.user_api_token_created]: UserApiTokenCreatedEventData,
  [EventType.user_api_token_updated]: UserApiTokenUpdatedEventData,
  [EventType.user_api_token_deleted]: UserApiTokenDeletedEventData,
  [EventType.org_created]: UserOrgCreatedEventData,
  [EventType.org_updated]: OrgUpdatedEventData,
  [EventType.org_logo_set]: OrgEventData,
  [EventType.org_logo_removed]: OrgEventData,
  [EventType.org_invite_added]: OrgInviteAddedEventData,
  [EventType.org_invite_deleted]: OrgInviteDeletedEventData,
  [EventType.org_invite_accepted]: OrgInviteAcceptedEventData,
  [EventType.org_invite_declined]: OrgInviteDeclinedEventData,
  [EventType.org_member_joined]: OrgMemberJoinedEventData,
  [EventType.org_member_updated]: OrgMemberUpdatedEventData,
  [EventType.org_member_deleted]: OrgMemberDeletedEventData,
  [EventType.org_hook_created]: OrgHookCreatedEventData,
  [EventType.org_hook_updated]: OrgHookUpdatedEventData,
  [EventType.org_hook_deleted]: OrgHookDeletedEventData,
  [EventType.project_added]: OrgProjectAddedEventData,
  [EventType.project_updated]: ProjectUpdatedEventData,
  [EventType.project_deleted]: ProjectDeletedEventData,
  [EventType.project_logo_set]: ProjectEventData,
  [EventType.project_logo_removed]: ProjectEventData,
  [EventType.project_member_added]: ProjectMemberAddedEventData,
  [EventType.project_member_deleted]: ProjectMemberDeletedEventData,
  [EventType.project_hook_created]: ProjectHookCreatedEventData,
  [EventType.project_hook_updated]: ProjectHookUpdatedEventData,
  [EventType.project_hook_deleted]: ProjectHookDeletedEventData,
  [EventType.site_added]: ProjectSiteAddedEventData,
  [EventType.site_updated]: SiteUpdatedEventData,
  [EventType.site_deleted]: SiteDeletedEventData,
  [EventType.site_logo_set]: SiteEventData,
  [EventType.site_logo_removed]: SiteEventData,
  [EventType.site_password_set]: SitePasswordSetEventData,
  [EventType.site_password_removed]: SitePasswordRemovedEventData,
  [EventType.site_hook_created]: SiteHookCreatedEventData,
  [EventType.site_hook_updated]: SiteHookUpdatedEventData,
  [EventType.site_hook_deleted]: SiteHookDeletedEventData,
  [EventType.site_token_added]: SiteTokenAddedEventData,
  [EventType.site_token_deleted]: SiteTokenDeletedEventData,
  [EventType.site_release_created]: SiteReleaseCreatedEventData,
  [EventType.site_release_renamed]: SiteReleaseRenamedEventData,
  [EventType.site_release_deleted]: SiteReleaseDeletedEventData,
  [EventType.site_branch_added]: SiteBranchAddedEventData,
  [EventType.site_branch_updated]: SiteBranchUpdatedEventData,
  [EventType.site_branch_deleted]: SiteBranchDeletedEventData,
  [EventType.site_branch_release_set]: SiteBranchReleaseSetEventData,
  [EventType.site_branch_password_set]: SiteBranchPasswordSetEventData,
  [EventType.site_branch_password_removed]: SiteBranchPasswordRemovedEventData,
  [EventType.site_branch_redirects_set]: SiteBranchRedirectsSetEventData,
  [EventType.service_added]: ProjectServiceAddedEventData,
}
