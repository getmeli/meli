import * as EventData from '../../../events/event-data';
import { EventType } from '../../../events/event-type';
import { User } from '../../../entities/users/user';
import { ApiToken } from '../../../entities/api/api-token';
import { Org } from '../../../entities/orgs/org';
import { Invite } from '../../../entities/orgs/invite';
import { Member } from '../../../entities/members/member';
import { Hook } from '../../hook';
import { Team } from '../../../entities/teams/team';
import { Site, SiteToken } from '../../../entities/sites/site';
import { Branch } from '../../../entities/sites/branch';
import { Release } from '../../../entities/releases/release';
import { getBranchUrl } from '../../../entities/sites/get-branch-url';
import { getSiteUrl } from '../../../entities/sites/get-site-url';

function serializeUser(user: User) {
  return {
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    authProvider: user.authProvider,
    externalUserId: user.externalUserId,
    name: user.name,
    email: user.email,
  };
}

function serializeApiToken(apiToken: ApiToken) {
  return {
    _id: apiToken._id,
    name: apiToken.name,
    activatesAt: apiToken.activatesAt,
    expiresAt: apiToken.expiresAt,
    createdAt: apiToken.createdAt,
    updatedAt: apiToken.updatedAt,
    scopes: apiToken.scopes,
  };
}

function serializeOrg(org: Org) {
  return {
    _id: org._id,
    color: org.color,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
    ownerId: org.ownerId,
    name: org.name,
  };
}

function serializeInvite(invite: Invite) {
  return {
    _id: invite._id,
    email: invite.email,
    expiresAt: invite.expiresAt,
    memberOptions: {
      admin: invite.memberOptions.admin,
    },
  };
}

function serializeMember(member: Member) {
  return {
    _id: member._id,
    userId: member.userId,
    admin: member.admin,
    name: member.name,
    email: member.email,
  };
}

function serializeHook(hook: Hook) {
  return {
    _id: hook._id,
    name: hook.name,
    type: hook.type,
    events: hook.events,
    createdAt: hook.createdAt,
    updatedAt: hook.updatedAt,
  };
}

function serializeTeam(team: Team) {
  return {
    _id: team._id,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    name: team.name,
    color: team.color,
  };
}

function serializeBranch(site: Site, branch: Branch) {
  return {
    _id: branch._id,
    name: branch.name,
    slug: branch.slug,
    release: branch.release,
    hasPassword: !!branch.password,
    redirects: branch.redirects.map(redirect => ({
      _id: redirect._id,
      type: redirect.type,
      path: redirect.path,
    })),
    url: getBranchUrl(site, branch),
  };
}

function serializeSite(site: Site) {
  return {
    _id: site._id,
    teamId: site.teamId,
    color: site.color,
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
    name: site.name,
    mainBranch: site.mainBranch,
    domains: site.domains.map(domain => ({
      name: domain.name,
      sslConfiguration: {
        type: domain.sslConfiguration.type,
      },
    })),
    branches: site.branches.map(branch => serializeBranch(site, branch)),
    url: getSiteUrl(site),
  };
}

function serializeSiteToken(token: SiteToken) {
  return {
    _id: token._id,
    name: token.name,
    createdAt: token.createdAt,
  };
}

function serializeRelease(release: Release) {
  return {
    _id: release._id,
    siteId: release.siteId,
    name: release.name,
    date: release.date,
    branches: release.branches,
  };
}

export const getPayload: { [eventType in keyof EventData.EventData]: (data: any) => any } = {
  [EventType.user_api_token_created]: ({ user, apiToken }: EventData.UserApiTokenCreatedEventData) => ({
    user: serializeUser(user),
    apiToken: serializeApiToken(apiToken),
  }),
  [EventType.user_api_token_updated]: ({ user, apiToken }: EventData.UserApiTokenUpdatedEventData) => ({
    user: serializeUser(user),
    apiToken: serializeApiToken(apiToken),
  }),
  [EventType.user_api_token_deleted]: ({ user, apiToken }: EventData.UserApiTokenDeletedEventData) => ({
    user: serializeUser(user),
    apiToken: serializeApiToken(apiToken),
  }),
  [EventType.org_created]: ({ user, org }: EventData.UserOrgCreatedEventData) => ({
    user: serializeUser(user),
    org: serializeOrg(org),
  }),
  [EventType.org_updated]: ({ org }: EventData.OrgUpdatedEventData) => ({
    org: serializeOrg(org),
  }),
  [EventType.org_logo_set]: ({ org }: EventData.OrgEventData) => ({
    org: serializeOrg(org),
  }),
  [EventType.org_logo_removed]: ({ org }: EventData.OrgEventData) => ({
    org: serializeOrg(org),
  }),
  [EventType.org_invite_added]: ({ org, invite }: EventData.OrgInviteAddedEventData) => ({
    org: serializeOrg(org),
    invite: serializeInvite(invite),
  }),
  [EventType.org_invite_deleted]: ({ org, invite }: EventData.OrgInviteDeletedEventData) => ({
    org: serializeOrg(org),
    invite: serializeInvite(invite),
  }),
  [EventType.org_invite_accepted]: ({ org, invite }: EventData.OrgInviteAcceptedEventData) => ({
    org: serializeOrg(org),
    invite: serializeInvite(invite),
  }),
  [EventType.org_invite_declined]: ({ org, invite }: EventData.OrgInviteDeclinedEventData) => ({
    org: serializeOrg(org),
    invite: serializeInvite(invite),
  }),
  [EventType.org_member_joined]: ({ org, member }: EventData.OrgMemberJoinedEventData) => ({
    org: serializeOrg(org),
    member: serializeMember(member),
  }),
  [EventType.org_member_updated]: ({ org, member }: EventData.OrgMemberUpdatedEventData) => ({
    org: serializeOrg(org),
    member: serializeMember(member),
  }),
  [EventType.org_member_deleted]: ({ org, member }: EventData.OrgMemberDeletedEventData) => ({
    org: serializeOrg(org),
    member: serializeMember(member),
  }),
  [EventType.org_hook_created]: ({ org, hook }: EventData.OrgHookCreatedEventData) => ({
    org: serializeOrg(org),
    hook: serializeHook(hook),
  }),
  [EventType.org_hook_updated]: ({ org, hook }: EventData.OrgHookUpdatedEventData) => ({
    org: serializeOrg(org),
    hook: serializeHook(hook),
  }),
  [EventType.org_hook_deleted]: ({ org, hook }: EventData.OrgHookDeletedEventData) => ({
    org: serializeOrg(org),
    hook: serializeHook(hook),
  }),
  [EventType.team_added]: ({ org, team }: EventData.OrgTeamAddedEventData) => ({
    org: serializeOrg(org),
    team: serializeTeam(team),
  }),
  [EventType.team_updated]: ({ team }: EventData.TeamUpdatedEventData) => ({
    team: serializeTeam(team),
  }),
  [EventType.team_deleted]: ({ team }: EventData.TeamDeletedEventData) => ({
    team: serializeTeam(team),
  }),
  [EventType.team_logo_set]: ({ team }: EventData.TeamEventData) => ({
    team: serializeTeam(team),
  }),
  [EventType.team_logo_removed]: ({ team }: EventData.TeamEventData) => ({
    team: serializeTeam(team),
  }),
  [EventType.team_member_added]: ({ team, member }: EventData.TeamMemberAddedEventData) => ({
    team: serializeTeam(team),
    member: serializeMember(member),
  }),
  [EventType.team_member_deleted]: ({ team, member }: EventData.TeamMemberDeletedEventData) => ({
    team: serializeTeam(team),
    member: serializeMember(member),
  }),
  [EventType.team_hook_created]: ({ team, hook }: EventData.TeamHookCreatedEventData) => ({
    team: serializeTeam(team),
    hook: serializeHook(hook),
  }),
  [EventType.team_hook_updated]: ({ team, hook }: EventData.TeamHookUpdatedEventData) => ({
    team: serializeTeam(team),
    hook: serializeHook(hook),
  }),
  [EventType.team_hook_deleted]: ({ team, hook }: EventData.TeamHookDeletedEventData) => ({
    team: serializeTeam(team),
    hook: serializeHook(hook),
  }),
  [EventType.site_added]: ({ team, site }: EventData.TeamSiteAddedEventData) => ({
    team: serializeTeam(team),
    site: serializeSite(site),
  }),
  [EventType.site_updated]: ({ site }: EventData.SiteUpdatedEventData) => ({
    site: serializeSite(site),
  }),
  [EventType.site_deleted]: ({ site }: EventData.SiteDeletedEventData) => ({
    site: serializeSite(site),
  }),
  [EventType.site_logo_set]: ({ site }: EventData.SiteEventData) => ({
    site: serializeSite(site),
  }),
  [EventType.site_logo_removed]: ({ site }: EventData.SiteEventData) => ({
    site: serializeSite(site),
  }),
  [EventType.site_hook_created]: ({ site, hook }: EventData.SiteHookCreatedEventData) => ({
    site: serializeSite(site),
    hook: serializeHook(hook),
  }),
  [EventType.site_hook_updated]: ({ site, hook }: EventData.SiteHookUpdatedEventData) => ({
    site: serializeSite(site),
    hook: serializeHook(hook),
  }),
  [EventType.site_hook_deleted]: ({ site, hook }: EventData.SiteHookDeletedEventData) => ({
    site: serializeSite(site),
    hook: serializeHook(hook),
  }),
  [EventType.site_token_added]: ({ site, token }: EventData.SiteTokenAddedEventData) => ({
    site: serializeSite(site),
    token: serializeSiteToken(token),
  }),
  [EventType.site_token_deleted]: ({ site, token }: EventData.SiteTokenDeletedEventData) => ({
    site: serializeSite(site),
    token: serializeSiteToken(token),
  }),
  [EventType.site_password_set]: ({ site }: EventData.SitePasswordSetEventData) => ({
    site: serializeSite(site),
  }),
  [EventType.site_password_removed]: ({ site }: EventData.SitePasswordRemovedEventData) => ({
    site: serializeSite(site),
  }),
  [EventType.site_release_created]: ({ site, release }: EventData.SiteReleaseCreatedEventData) => ({
    site: serializeSite(site),
    release: serializeRelease(release),
  }),
  [EventType.site_release_renamed]: ({ site, release }: EventData.SiteReleaseRenamedEventData) => ({
    site: serializeSite(site),
    release: serializeRelease(release),
  }),
  [EventType.site_release_deleted]: ({ site, release }: EventData.SiteReleaseDeletedEventData) => ({
    site: serializeSite(site),
    release: serializeRelease(release),
  }),
  [EventType.site_branch_added]: ({ site, branch }: EventData.SiteBranchAddedEventData) => ({
    site: serializeSite(site),
    branch: serializeBranch(site, branch),
  }),
  [EventType.site_branch_updated]: ({ site, branch }: EventData.SiteBranchUpdatedEventData) => ({
    site: serializeSite(site),
    branch: serializeBranch(site, branch),
  }),
  [EventType.site_branch_deleted]: ({ site, branch }: EventData.SiteBranchDeletedEventData) => ({
    site: serializeSite(site),
    branch: serializeBranch(site, branch),
  }),
  [EventType.site_branch_release_set]: ({ site, branch, release }: EventData.SiteBranchReleaseSetEventData) => ({
    site: serializeSite(site),
    branch: serializeBranch(site, branch),
    release: serializeRelease(release),
  }),
  [EventType.site_branch_password_set]: ({ site, branch }: EventData.SiteBranchPasswordSetEventData) => ({
    site: serializeSite(site),
    branch: serializeBranch(site, branch),
  }),
  [EventType.site_branch_password_removed]: ({ site, branch }: EventData.SiteBranchPasswordRemovedEventData) => ({
    site: serializeSite(site),
    branch: serializeBranch(site, branch),
  }),
  [EventType.site_branch_redirects_set]: ({ site, branch }: EventData.SiteBranchRedirectsSetEventData) => ({
    site: serializeSite(site),
    branch: serializeBranch(site, branch),
  }),
};
