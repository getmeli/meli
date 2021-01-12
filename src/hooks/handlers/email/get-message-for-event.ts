import * as EventData from '../../../events/event-data';
import { EventType } from '../../../events/event-type';
import { getSiteUrl } from '../../../entities/sites/get-site-url';
import { getBranchUrl } from '../../../entities/sites/get-branch-url';
import { getRedirectUrl } from '../../../entities/sites/get-redirect-url';
import { EmailHookMessage } from './send-email-hook';

export const getMessageForEvent: { [eventType in keyof EventData.EventData]: (data: any) => EmailHookMessage } = {
  [EventType.user_api_token_created]: ({ user, apiToken }: EventData.UserApiTokenCreatedEventData) => ({
    subject: 'User api token created',
    text: `An api token named ${apiToken.name} was created for user ${user.name}.`,
  }),
  [EventType.user_api_token_updated]: ({ user, apiToken }: EventData.UserApiTokenUpdatedEventData) => ({
    subject: 'User api token updated',
    text: `Api token named ${apiToken.name} was updated for user ${user.name}.`,
  }),
  [EventType.user_api_token_deleted]: ({ user, apiToken }: EventData.UserApiTokenDeletedEventData) => ({
    subject: 'User api token deleted',
    text: `Api token named ${apiToken.name} was deleted for user ${user.name}.`,
  }),
  [EventType.user_org_created]: ({ user, org }: EventData.UserOrgCreatedEventData) => ({
    subject: 'User org created',
    text: `Organization ${org.name} was created for user ${user.name}.`,
  }),
  [EventType.org_updated]: ({ org }: EventData.OrgUpdatedEventData) => ({
    subject: 'Org updated',
    text: `Organization ${org.name} was updated.`,
  }),
  [EventType.org_logo_set]: ({ org }: EventData.OrgEventData) => ({
    subject: 'Org logo set',
    text: `The logo of organization ${org.name} was set.`,
  }),
  [EventType.org_logo_removed]: ({ org }: EventData.OrgEventData) => ({
    subject: 'Org logo removed',
    text: `The logo of organization ${org.name} was removed.`,
  }),
  [EventType.org_invite_added]: ({ org, invite }: EventData.OrgInviteAddedEventData) => ({
    subject: 'Org invite added',
    text: `${invite.email} was invited to join organization ${org.name}.`,
  }),
  [EventType.org_invite_deleted]: ({ org, invite }: EventData.OrgInviteDeletedEventData) => ({
    subject: 'Org invite deleted',
    text: `The invitation of ${invite.email} to join organization ${org.name} was deleted.`,
  }),
  [EventType.org_invite_accepted]: ({ org, invite }: EventData.OrgInviteAcceptedEventData) => ({
    subject: 'Org invite accepted',
    text: `${invite.email} accepted to join organization ${org.name}.`,
  }),
  [EventType.org_invite_declined]: ({ org, invite }: EventData.OrgInviteDeclinedEventData) => ({
    subject: 'Org invite declined',
    text: `${invite.email} declied to join organization ${org.name}.`,
  }),
  [EventType.org_member_joined]: ({ org, member }: EventData.OrgMemberJoinedEventData) => ({
    subject: 'Org member joined',
    text: `${member.name} joined organization ${org.name}.`,
  }),
  [EventType.org_member_updated]: ({ org, member }: EventData.OrgMemberUpdatedEventData) => ({
    subject: 'Org member updated',
    text: `${member.name} from organization ${org.name} was updated.`,
  }),
  [EventType.org_member_deleted]: ({ org, member }: EventData.OrgMemberDeletedEventData) => ({
    subject: 'Org member deleted',
    text: `${member.name} left organization ${org.name}.`,
  }),
  [EventType.org_hook_created]: ({ org, hook }: EventData.OrgHookCreatedEventData) => ({
    subject: 'Org hook created',
    text: `Hook ${hook.name} of type ${hook.type} was created for organization ${org.name}.`,
  }),
  [EventType.org_hook_updated]: ({ org, hook }: EventData.OrgHookUpdatedEventData) => ({
    subject: 'Org hook updated',
    text: `Hook ${hook.name} of type ${hook.type} from organization ${org.name} was updated.`,
  }),
  [EventType.org_hook_deleted]: ({ org, hook }: EventData.OrgHookDeletedEventData) => ({
    subject: 'Org hook deleted',
    text: `Hook ${hook.name} of type ${hook.type} from organization ${org.name} was deleted.`,
  }),
  [EventType.org_team_added]: ({ org, team }: EventData.OrgTeamAddedEventData) => ({
    subject: 'Org team added',
    text: `Team ${team.name} was added to organization ${org.name}.`,
  }),
  [EventType.team_updated]: ({ team }: EventData.TeamUpdatedEventData) => ({
    subject: 'Team updated',
    text: `Team ${team.name} was updated.`,
  }),
  [EventType.team_deleted]: ({ team }: EventData.TeamDeletedEventData) => ({
    subject: 'Team deleted',
    text: `Team ${team.name} was deleted.`,
  }),
  [EventType.team_logo_set]: ({ team }: EventData.TeamEventData) => ({
    subject: 'Team logo set',
    text: `The logo of team ${team.name} was set.`,
  }),
  [EventType.team_logo_removed]: ({ team }: EventData.TeamEventData) => ({
    subject: 'Team logo removed',
    text: `The logo of team ${team.name} was removed.`,
  }),
  [EventType.team_member_added]: ({ team, member }: EventData.TeamMemberAddedEventData) => ({
    subject: 'Team member added',
    text: `${member.name} was added to team ${team.name}.`,
  }),
  [EventType.team_member_deleted]: ({ team, member }: EventData.TeamMemberDeletedEventData) => ({
    subject: 'Team member deleted',
    text: `${member.name} was removed from team ${team.name}.`,
  }),
  [EventType.team_hook_created]: ({ team, hook }: EventData.TeamHookCreatedEventData) => ({
    subject: 'Team hook created',
    text: `Hook ${hook.name} of type ${hook.type} was added to team ${team.name}.`,
  }),
  [EventType.team_hook_updated]: ({ team, hook }: EventData.TeamHookUpdatedEventData) => ({
    subject: 'Team hook updated',
    text: `Hook ${hook.name} of type ${hook.type} of team ${team.name} was updated.`,
  }),
  [EventType.team_hook_deleted]: ({ team, hook }: EventData.TeamHookDeletedEventData) => ({
    subject: 'Team hook deleted',
    text: `Hook ${hook.name} of type ${hook.type} was removed from team ${team.name}.`,
  }),
  [EventType.team_site_added]: ({ team, site }: EventData.TeamSiteAddedEventData) => ({
    subject: 'Team site added',
    text: `Site ${site.name} was added to team ${team.name}. View it live here: ${getSiteUrl(site)}. `,
  }),
  [EventType.site_updated]: ({ site }: EventData.SiteUpdatedEventData) => ({
    subject: 'Team site added',
    text: `Site ${site.name} was updated. View it live here: ${getSiteUrl(site)}. `,
  }),
  [EventType.site_deleted]: ({ site }: EventData.SiteDeletedEventData) => ({
    subject: 'Site deleted',
    text: `Site ${site.name} was deleted.`,
  }),
  [EventType.site_logo_set]: ({ site }: EventData.SiteEventData) => ({
    subject: 'Site logo set',
    text: `The logo of site ${site.name} was set.`,
  }),
  [EventType.site_logo_removed]: ({ site }: EventData.SiteEventData) => ({
    subject: 'Site logo removed',
    text: `The logo of site ${site.name} was removed.`,
  }),
  [EventType.site_hook_created]: ({ site, hook }: EventData.SiteHookCreatedEventData) => ({
    subject: 'Site hook created',
    text: `Hook ${hook.name} of type ${hook.type} was added to site ${site.name}.`,
  }),
  [EventType.site_hook_updated]: ({ site, hook }: EventData.SiteHookUpdatedEventData) => ({
    subject: 'Site hook updated',
    text: `Hook ${hook.name} of type ${hook.type} of site ${site.name} was updated.`,
  }),
  [EventType.site_hook_deleted]: ({ site, hook }: EventData.SiteHookDeletedEventData) => ({
    subject: 'Site hook deleted',
    text: `Hook ${hook.name} of type ${hook.type} was removed from site ${site.name}.`,
  }),
  [EventType.site_token_added]: ({ site, token }: EventData.SiteTokenAddedEventData) => ({
    subject: 'Site token added',
    text: `Token ${token.name} was added to site ${site.name}.`,
  }),
  [EventType.site_token_deleted]: ({ site, token }: EventData.SiteTokenDeletedEventData) => ({
    subject: 'Site token deleted',
    text: `Token ${token.name} was removed from site ${site.name}.`,
  }),
  [EventType.site_password_set]: ({ site }: EventData.SitePasswordSetEventData) => ({
    subject: 'Site password set',
    text: `As password was set for site ${site.name}.`,
  }),
  [EventType.site_password_removed]: ({ site }: EventData.SitePasswordRemovedEventData) => ({
    subject: 'Site password removed',
    text: `Password protection was removed from site ${site.name}.`,
  }),
  [EventType.site_release_created]: ({ site, release }: EventData.SiteReleaseCreatedEventData) => ({
    text: 'Site release created',
    subject: `Release ${release.name} was added to site ${site.name}. View it live here:
${release.branches.map(branchId => {
      const branch = site.branches.find(b => b._id === branchId);
      const branchUrl = getBranchUrl(site, branch);
      const isMainBranch = site.mainBranch === branch._id;
      if (!isMainBranch) {
        return `- ${branchUrl}\n`;
      }
      const siteUrl = getSiteUrl(site);
      return `- ${branchUrl}\n
- ${siteUrl}\n
`;
    })}`,
  }),
  [EventType.site_release_renamed]: ({ site, release }: EventData.SiteReleaseRenamedEventData) => ({
    subject: 'Site release renamed',
    text: `Release ${release.name} from site ${site.name} was renamed.`,
  }),
  [EventType.site_release_deleted]: ({ site, release }: EventData.SiteReleaseDeletedEventData) => ({
    subject: 'Site release deleted',
    text: `Release ${release.name} from site ${site.name} was deleted.`,
  }),
  [EventType.site_branch_added]: ({ site, branch }: EventData.SiteBranchAddedEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the main branch, also live here: ${getSiteUrl(site)}.` : '';
    return {
      subject: 'Site branch added',
      text: `Branch ${branch.name} was added to site ${site.name}.
View it live here: ${getBranchUrl(site, branch)}. ${mainBranchUrl}`.trim(),
    };
  },
  [EventType.site_branch_updated]: ({ site, branch }: EventData.SiteBranchUpdatedEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the main branch, also live here: ${getSiteUrl(site)}.` : '';
    return {
      subject: 'Site branch updated',
      text: `Branch ${branch.name} from site ${site.name} was updated.
View it live here: ${getBranchUrl(site, branch)}. ${mainBranchUrl}`.trim(),
    };
  },
  [EventType.site_branch_deleted]: ({ site, branch }: EventData.SiteBranchDeletedEventData) => ({
    subject: 'Site branch deleted',
    text: `Branch ${branch.name} was removed from site ${site.name}.`,
  }),
  [EventType.site_branch_release_set]: ({ site, branch, release }: EventData.SiteBranchReleaseSetEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the main branch, also live here: ${getSiteUrl(site)}.` : '';
    return {
      subject: 'Site branch release set',
      text: `The current release of branch ${branch.name} from site ${site.name} was set to ${release.name}.
View it live here: ${getBranchUrl(site, branch)}. ${mainBranchUrl}`.trim(),
    };
  },
  [EventType.site_branch_password_set]: ({ site, branch }: EventData.SiteBranchPasswordSetEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the main branch, also live here: ${getSiteUrl(site)}.` : '';
    return {
      subject: 'Site branch password set',
      text: `Branch ${branch.name} from site ${site.name} is now protected by password.
View it live here: ${getBranchUrl(site, branch)}. ${mainBranchUrl}`.trim(),
    };
  },
  [EventType.site_branch_password_removed]: ({ site, branch }: EventData.SiteBranchPasswordRemovedEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the main branch, also live here: ${getSiteUrl(site)}.` : '';
    return {
      subject: 'Site branch password removed',
      text: `Password protection of branch ${branch.name} from site ${site.name} was disabled.
View it live here: ${getBranchUrl(site, branch)}. ${mainBranchUrl}`.trim(),
    };
  },
  [EventType.site_branch_redirects_set]: ({ site, branch }: EventData.SiteBranchRedirectsSetEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the main branch, also live here: ${getSiteUrl(site)}.` : '';
    const message = !branch.redirects || branch.redirects.length === 0
      ? `Redirects of branch ${branch.name} from site ${site.name} have been removed`
      : `Redirects of branch ${branch.name} from site ${site.name} have been updated:
${branch.redirects.map(redirect => `- ${redirect.type} ${redirect.path} available here: ${getRedirectUrl(site, branch, redirect)}`)}
View branch live here: ${getBranchUrl(site, branch)}. ${mainBranchUrl}
`;
    return {
      subject: 'Site branch redirects set',
      text: message.trim(),
    };
  },
};
