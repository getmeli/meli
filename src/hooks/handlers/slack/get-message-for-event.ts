import * as EventData from '../../../events/event-data';
import { EventType } from '../../../events/event-type';
import { getSlackMessage } from './get-slack-message';
import { getSiteUrl } from '../../../entities/sites/get-site-url';
import { getBranchUrl } from '../../../entities/sites/get-branch-url';
import { getRedirectUrl } from '../../../entities/sites/get-redirect-url';

export const getMessageForEvent: { [eventType in keyof EventData.EventData]: (data: any) => any } = {
  [EventType.user_api_token_created]: ({ user, apiToken }: EventData.UserApiTokenCreatedEventData) => (
    getSlackMessage(
      'User api token created',
      `An api token named **${apiToken.name}** was created for user **${user.name}**.`,
    )
  ),
  [EventType.user_api_token_updated]: ({ user, apiToken }: EventData.UserApiTokenUpdatedEventData) => (
    getSlackMessage(
      'User api token updated',
      `Api token named **${apiToken.name}** was updated for user **${user.name}**.`,
    )
  ),
  [EventType.user_api_token_deleted]: ({ user, apiToken }: EventData.UserApiTokenDeletedEventData) => (
    getSlackMessage(
      'User api token deleted',
      `Api token named **${apiToken.name}** was deleted for user **${user.name}**.`,
    )
  ),
  [EventType.user_org_created]: ({ user, org }: EventData.UserOrgCreatedEventData) => (
    getSlackMessage(
      'User org created',
      `Organization **${org.name}** was created for user **${user.name}**.`,
    )
  ),
  [EventType.org_updated]: ({ org }: EventData.OrgUpdatedEventData) => (
    getSlackMessage(
      'Org updated',
      `Organization **${org.name}** was updated.`,
    )
  ),
  [EventType.org_invite_added]: ({ org, invite }: EventData.OrgInviteAddedEventData) => (
    getSlackMessage(
      'Org invite added',
      `**${invite.email}** was invited to join organization **${org.name}**.`,
    )
  ),
  [EventType.org_invite_deleted]: ({ org, invite }: EventData.OrgInviteDeletedEventData) => (
    getSlackMessage(
      'Org invite deleted',
      `The invitation of **${invite.email}** to join organization **${org.name}** was deleted.`,
    )
  ),
  [EventType.org_invite_accepted]: ({ org, invite }: EventData.OrgInviteAcceptedEventData) => (
    getSlackMessage(
      'Org invite accepted',
      `**${invite.email}** accepted to join organization **${org.name}**.`,
    )
  ),
  [EventType.org_invite_declined]: ({ org, invite }: EventData.OrgInviteDeclinedEventData) => (
    getSlackMessage(
      'Org invite declined',
      `**${invite.email}** declied to join organization **${org.name}**.`,
    )
  ),
  [EventType.org_member_joined]: ({ org, member }: EventData.OrgMemberJoinedEventData) => (
    getSlackMessage(
      'Org member joined',
      `**${member.name}** joined organization **${org.name}**.`,
    )
  ),
  [EventType.org_member_updated]: ({ org, member }: EventData.OrgMemberUpdatedEventData) => (
    getSlackMessage(
      'Org member updated',
      `**${member.name}** from organization **${org.name}** was updated.`,
    )
  ),
  [EventType.org_member_deleted]: ({ org, member }: EventData.OrgMemberDeletedEventData) => (
    getSlackMessage(
      'Org member deleted',
      `**${member.name}** left organization **${org.name}**.`,
    )
  ),
  [EventType.org_hook_created]: ({ org, hook }: EventData.OrgHookCreatedEventData) => (
    getSlackMessage(
      'Org hook created',
      `Hook **${hook.name}** of type **${hook.type}** was created for organization **${org.name}**.`,
    )
  ),
  [EventType.org_hook_updated]: ({ org, hook }: EventData.OrgHookUpdatedEventData) => (
    getSlackMessage(
      'Org hook updated',
      `Hook **${hook.name}** of type **${hook.type}** from organization **${org.name}** was updated.`,
    )
  ),
  [EventType.org_hook_deleted]: ({ org, hook }: EventData.OrgHookDeletedEventData) => (
    getSlackMessage(
      'Org hook deleted',
      `Hook **${hook.name}** of type **${hook.type}** from organization **${org.name}** was deleted.`,
    )
  ),
  [EventType.org_team_added]: ({ org, team }: EventData.OrgTeamAddedEventData) => (
    getSlackMessage(
      'Org team added',
      `Team **${team.name}** was added to organization **${org.name}**.`,
    )
  ),
  [EventType.team_updated]: ({ team }: EventData.TeamUpdatedEventData) => (
    getSlackMessage(
      'Team updated',
      `Team **${team.name}** was updated.`,
    )
  ),
  [EventType.team_deleted]: ({ team }: EventData.TeamDeletedEventData) => (
    getSlackMessage(
      'Team deleted',
      `Team **${team.name}** was deleted.`,
    )
  ),
  [EventType.team_member_added]: ({ team, member }: EventData.TeamMemberAddedEventData) => (
    getSlackMessage(
      'Team member added',
      `**${member.name}** was added to team **${team.name}**.`,
    )
  ),
  [EventType.team_member_deleted]: ({ team, member }: EventData.TeamMemberDeletedEventData) => (
    getSlackMessage(
      'Team member deleted',
      `**${member.name}** was removed from team **${team.name}**.`,
    )
  ),
  [EventType.team_hook_created]: ({ team, hook }: EventData.TeamHookCreatedEventData) => (
    getSlackMessage(
      'Team hook created',
      `Hook **${hook.name}** of type **${hook.type}** was added to team **${team.name}**.`,
    )
  ),
  [EventType.team_hook_updated]: ({ team, hook }: EventData.TeamHookUpdatedEventData) => (
    getSlackMessage(
      'Team hook updated',
      `Hook **${hook.name}** of type **${hook.type}** of team **${team.name}** was updated.`,
    )
  ),
  [EventType.team_hook_deleted]: ({ team, hook }: EventData.TeamHookDeletedEventData) => (
    getSlackMessage(
      'Team hook deleted',
      `Hook **${hook.name}** of type **${hook.type}** was removed from team **${team.name}**.`,
    )
  ),
  [EventType.team_site_added]: ({ team, site }: EventData.TeamSiteAddedEventData) => (
    getSlackMessage(
      'Team site added',
      `Site **${site.name}** was added to team **${team.name}**. View it live [here](${getSiteUrl(site)}). `,
    )
  ),
  [EventType.site_updated]: ({ site }: EventData.SiteUpdatedEventData) => (
    getSlackMessage(
      'Team site added',
      `Site **${site.name}** was updated. View it live [here](${getSiteUrl(site)}). `,
    )
  ),
  [EventType.site_deleted]: ({ site }: EventData.SiteDeletedEventData) => (
    getSlackMessage(
      'Site deleted',
      `Site **${site.name}** was deleted.`,
    )
  ),
  [EventType.site_hook_created]: ({ site, hook }: EventData.SiteHookCreatedEventData) => (
    getSlackMessage(
      'Site hook created',
      `Hook **${hook.name}** of type **${hook.type}** was added to site **${site.name}**.`,
    )
  ),
  [EventType.site_hook_updated]: ({ site, hook }: EventData.SiteHookUpdatedEventData) => (
    getSlackMessage(
      'Site hook updated',
      `Hook **${hook.name}** of type **${hook.type}** of site **${site.name}** was updated.`,
    )
  ),
  [EventType.site_hook_deleted]: ({ site, hook }: EventData.SiteHookDeletedEventData) => (
    getSlackMessage(
      'Site hook deleted',
      `Hook **${hook.name}** of type **${hook.type}** was removed from site **${site.name}**.`,
    )
  ),
  [EventType.site_token_added]: ({ site, token }: EventData.SiteTokenAddedEventData) => (
    getSlackMessage(
      'Site token added',
      `Token **${token.name}** was added to site **${site.name}**.`,
    )
  ),
  [EventType.site_token_deleted]: ({ site, token }: EventData.SiteTokenDeletedEventData) => (
    getSlackMessage(
      'Site token deleted',
      `Token **${token.name}** was removed from site **${site.name}**.`,
    )
  ),
  [EventType.site_password_set]: ({ site }: EventData.SitePasswordSetEventData) => (
    getSlackMessage(
      'Site password set',
      `Password protection is now **enabled** for site **${site.name}**.`,
    )
  ),
  [EventType.site_password_removed]: ({ site }: EventData.SitePasswordRemovedEventData) => (
    getSlackMessage(
      'Site password removed',
      `Password protection was **disabled** for site **${site.name}**.`,
    )
  ),
  [EventType.site_release_created]: ({ site, release }: EventData.SiteReleaseCreatedEventData) => (
    getSlackMessage(
      'Site release created',
      `Release **${release.name}** was added to site **${site.name}**. View it live here:
${release.branches.map(branchId => {
      const branch = site.branches.find(b => b._id === branchId);
      const branchUrl = getBranchUrl(site, branch);
      const isMainBranch = site.mainBranch === branch._id;
      if (!isMainBranch) {
        return `- [${branchUrl}](${branchUrl})\n`;
      }
      const siteUrl = getSiteUrl(site);
      return `- [${branchUrl}](${branchUrl})\n
- [${siteUrl}](${siteUrl})\n
`;
    })}`,
    )
  ),
  [EventType.site_release_renamed]: ({ site, release }: EventData.SiteReleaseRenamedEventData) => (
    getSlackMessage(
      'Site release renamed',
      `Release **${release.name}** from site **${site.name}** was renamed.`,
    )
  ),
  [EventType.site_release_deleted]: ({ site, release }: EventData.SiteReleaseDeletedEventData) => (
    getSlackMessage(
      'Site release deleted',
      `Release **${release.name}** from site **${site.name}** was deleted.`,
    )
  ),
  [EventType.site_branch_added]: ({ site, branch }: EventData.SiteBranchAddedEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    return getSlackMessage(
      'Site branch added',
      `Branch **${branch.name}** was added to site **${site.name}**.
View it live [here](${getBranchUrl(site, branch)}). ${mainBranchUrl}`.trim(),
    );
  },
  [EventType.site_branch_updated]: ({ site, branch }: EventData.SiteBranchUpdatedEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    return getSlackMessage(
      'Site branch updated',
      `Branch **${branch.name}** from site **${site.name}** was updated.
View it live [here](${getBranchUrl(site, branch)}). ${mainBranchUrl}`.trim(),
    );
  },
  [EventType.site_branch_deleted]: ({ site, branch }: EventData.SiteBranchDeletedEventData) => (
    getSlackMessage(
      'Site branch deleted',
      `Branch **${branch.name}** was removed from site **${site.name}**.`,
    )
  ),
  [EventType.site_branch_release_set]: ({ site, branch, release }: EventData.SiteBranchReleaseSetEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    return getSlackMessage(
      'Site branch release set',
      `The current release of branch **${branch.name}** from site **${site.name}** was set to **${release.name}**.
View it live [here](${getBranchUrl(site, branch)}). ${mainBranchUrl}`.trim(),
    );
  },
  [EventType.site_branch_password_set]: ({ site, branch }: EventData.SiteBranchPasswordSetEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    return getSlackMessage(
      'Site branch password set',
      `Branch **${branch.name}** from site **${site.name}** is now protected by **password**.
View it live [here](${getBranchUrl(site, branch)}). ${mainBranchUrl}`.trim(),
    );
  },
  [EventType.site_branch_password_removed]: ({ site, branch }: EventData.SiteBranchPasswordRemovedEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    return getSlackMessage(
      'Site branch password removed',
      `Password protection of branch **${branch.name}** from site **${site.name}** was **disabled**.
View it live [here](${getBranchUrl(site, branch)}). ${mainBranchUrl}`.trim(),
    );
  },
  [EventType.site_branch_redirects_set]: ({ site, branch }: EventData.SiteBranchRedirectsSetEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    const message = !branch.redirects || branch.redirects.length === 0
      ? `Redirects of branch **${branch.name}** from site **${site.name}** have been removed`
      : `Redirects of branch **${branch.name}** from site **${site.name}** have been updated:
${branch.redirects.map(redirect => `- **${redirect.type}** ${redirect.path} available [here](${getRedirectUrl(site, branch, redirect)})`)}
View branch live [here](${getBranchUrl(site, branch)}). ${mainBranchUrl}
`;
    return getSlackMessage(
      'Site branch redirects set',
      message.trim(),
    );
  },
};
