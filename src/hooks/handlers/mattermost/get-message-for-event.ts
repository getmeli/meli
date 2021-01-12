import * as EventData from '../../../events/event-data';
import { EventType } from '../../../events/event-type';
import { getSiteUrl } from '../../../entities/sites/get-site-url';
import { getBranchUrl } from '../../../entities/sites/get-branch-url';
import { getRedirectUrl } from '../../../entities/sites/get-redirect-url';
import { getMattermostMessage } from './get-mattermost-message';

export const getMessageForEvent: { [eventType in keyof EventData.EventData]: (data: any) => any } = {
  [EventType.user_api_token_created]: ({ user, apiToken }: EventData.UserApiTokenCreatedEventData) => (
    getMattermostMessage(`An api token named **${apiToken.name}** was created for user **${user.name}**.`)
  ),
  [EventType.user_api_token_updated]: ({ user, apiToken }: EventData.UserApiTokenUpdatedEventData) => (
    getMattermostMessage(`Api token named **${apiToken.name}** was updated for user **${user.name}**.`)
  ),
  [EventType.user_api_token_deleted]: ({ user, apiToken }: EventData.UserApiTokenDeletedEventData) => (
    getMattermostMessage(`Api token named **${apiToken.name}** was deleted for user **${user.name}**.`)
  ),
  [EventType.user_org_created]: ({ user, org }: EventData.UserOrgCreatedEventData) => (
    getMattermostMessage(`Organization **${org.name}** was created for user **${user.name}**.`)
  ),
  [EventType.org_updated]: ({ org }: EventData.OrgUpdatedEventData) => (
    getMattermostMessage(`Organization **${org.name}** was updated.`)
  ),
  [EventType.org_logo_set]: ({ org }: EventData.OrgEventData) => (
    getMattermostMessage(`The logo of organization **${org.name}** was set.`)
  ),
  [EventType.org_logo_removed]: ({ org }: EventData.OrgEventData) => (
    getMattermostMessage(`The logo of organization **${org.name}** was removed.`)
  ),
  [EventType.org_invite_added]: ({ org, invite }: EventData.OrgInviteAddedEventData) => (
    getMattermostMessage(`**${invite.email}** was invited to join organization **${org.name}**.`)
  ),
  [EventType.org_invite_deleted]: ({ org, invite }: EventData.OrgInviteDeletedEventData) => (
    getMattermostMessage(`The invitation of **${invite.email}** to join organization **${org.name}** was deleted.`)
  ),
  [EventType.org_invite_accepted]: ({ org, invite }: EventData.OrgInviteAcceptedEventData) => (
    getMattermostMessage(`**${invite.email}** accepted to join organization **${org.name}**.`)
  ),
  [EventType.org_invite_declined]: ({ org, invite }: EventData.OrgInviteDeclinedEventData) => (
    getMattermostMessage(`**${invite.email}** declied to join organization **${org.name}**.`)
  ),
  [EventType.org_member_joined]: ({ org, member }: EventData.OrgMemberJoinedEventData) => (
    getMattermostMessage(`**${member.name}** joined organization **${org.name}**.`)
  ),
  [EventType.org_member_updated]: ({ org, member }: EventData.OrgMemberUpdatedEventData) => (
    getMattermostMessage(`**${member.name}** from organization **${org.name}** was updated.`)
  ),
  [EventType.org_member_deleted]: ({ org, member }: EventData.OrgMemberDeletedEventData) => (
    getMattermostMessage(`**${member.name}** left organization **${org.name}**.`)
  ),
  [EventType.org_hook_created]: ({ org, hook }: EventData.OrgHookCreatedEventData) => (
    getMattermostMessage(`Hook **${hook.name}** of type **${hook.type}** was created for organization **${org.name}**.`)
  ),
  [EventType.org_hook_updated]: ({ org, hook }: EventData.OrgHookUpdatedEventData) => (
    getMattermostMessage(`Hook **${hook.name}** of type **${hook.type}** from organization **${org.name}** was updated.`)
  ),
  [EventType.org_hook_deleted]: ({ org, hook }: EventData.OrgHookDeletedEventData) => (
    getMattermostMessage(`Hook **${hook.name}** of type **${hook.type}** from organization **${org.name}** was deleted.`)
  ),
  [EventType.org_team_added]: ({ org, team }: EventData.OrgTeamAddedEventData) => (
    getMattermostMessage(`Team **${team.name}** was added to organization **${org.name}**.`)
  ),
  [EventType.team_updated]: ({ team }: EventData.TeamUpdatedEventData) => (
    getMattermostMessage(`Team **${team.name}** was updated.`)
  ),
  [EventType.team_deleted]: ({ team }: EventData.TeamDeletedEventData) => (
    getMattermostMessage(`Team **${team.name}** was deleted.`)
  ),
  [EventType.team_logo_set]: ({ team }: EventData.TeamEventData) => (
    getMattermostMessage(`The logo of team **${team.name}** was set.`)
  ),
  [EventType.team_logo_removed]: ({ team }: EventData.TeamEventData) => (
    getMattermostMessage(`The logo of team **${team.name}** was removed.`)
  ),
  [EventType.team_member_added]: ({ team, member }: EventData.TeamMemberAddedEventData) => (
    getMattermostMessage(`**${member.name}** was added to team **${team.name}**.`)
  ),
  [EventType.team_member_deleted]: ({ team, member }: EventData.TeamMemberDeletedEventData) => (
    getMattermostMessage(`**${member.name}** was removed from team **${team.name}**.`)
  ),
  [EventType.team_hook_created]: ({ team, hook }: EventData.TeamHookCreatedEventData) => (
    getMattermostMessage(`Hook **${hook.name}** of type **${hook.type}** was added to team **${team.name}**.`)
  ),
  [EventType.team_hook_updated]: ({ team, hook }: EventData.TeamHookUpdatedEventData) => (
    getMattermostMessage(`Hook **${hook.name}** of type **${hook.type}** of team **${team.name}** was updated.`)
  ),
  [EventType.team_hook_deleted]: ({ team, hook }: EventData.TeamHookDeletedEventData) => (
    getMattermostMessage(`Hook **${hook.name}** of type **${hook.type}** was removed from team **${team.name}**.`)
  ),
  [EventType.team_site_added]: ({ team, site }: EventData.TeamSiteAddedEventData) => (
    getMattermostMessage(`
Site **${site.name}** was added to team **${team.name}**. View it live [here](${getSiteUrl(site)}). `)
  ),
  [EventType.site_updated]: ({ site }: EventData.SiteUpdatedEventData) => (
    getMattermostMessage(`
Site **${site.name}** was updated. View it live [here](${getSiteUrl(site)}). `)
  ),
  [EventType.site_deleted]: ({ site }: EventData.SiteDeletedEventData) => (
    getMattermostMessage(`Site **${site.name}** was deleted.`)
  ),
  [EventType.site_logo_set]: ({ site }: EventData.SiteEventData) => (
    getMattermostMessage(`The logo of site **${site.name}** was set.`)
  ),
  [EventType.site_logo_removed]: ({ site }: EventData.SiteEventData) => (
    getMattermostMessage(`The logo of site **${site.name}** was removed.`)
  ),
  [EventType.site_hook_created]: ({ site, hook }: EventData.SiteHookCreatedEventData) => (
    getMattermostMessage(`Hook **${hook.name}** of type **${hook.type}** was added to site **${site.name}**.`)
  ),
  [EventType.site_hook_updated]: ({ site, hook }: EventData.SiteHookUpdatedEventData) => (
    getMattermostMessage(`Hook **${hook.name}** of type **${hook.type}** of site **${site.name}** was updated.`)
  ),
  [EventType.site_hook_deleted]: ({ site, hook }: EventData.SiteHookDeletedEventData) => (
    getMattermostMessage(`Hook **${hook.name}** of type **${hook.type}** was removed from site **${site.name}**.`)
  ),
  [EventType.site_token_added]: ({ site, token }: EventData.SiteTokenAddedEventData) => (
    getMattermostMessage(`Token **${token.name}** was added to site **${site.name}**.`)
  ),
  [EventType.site_token_deleted]: ({ site, token }: EventData.SiteTokenDeletedEventData) => (
    getMattermostMessage(`Token **${token.name}** was removed from site **${site.name}**.`)
  ),
  [EventType.site_password_set]: ({ site }: EventData.SitePasswordSetEventData) => (
    getMattermostMessage(`Password protection is now **enabled** for site **${site.name}**.`)
  ),
  [EventType.site_password_removed]: ({ site }: EventData.SitePasswordRemovedEventData) => (
    getMattermostMessage(`Password protection was **disabled** for site **${site.name}**.`)
  ),
  [EventType.site_release_created]: ({ site, release }: EventData.SiteReleaseCreatedEventData) => (
    getMattermostMessage(
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
    getMattermostMessage(`Release **${release.name}** from site **${site.name}** was renamed.`)
  ),
  [EventType.site_release_deleted]: ({ site, release }: EventData.SiteReleaseDeletedEventData) => (
    getMattermostMessage(`Release **${release.name}** from site **${site.name}** was deleted.`)
  ),
  [EventType.site_branch_added]: ({ site, branch }: EventData.SiteBranchAddedEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    return getMattermostMessage(
      `Branch **${branch.name}** was added to site **${site.name}**.
View it live [here](${getBranchUrl(site, branch)}). ${mainBranchUrl}`.trim(),
    );
  },
  [EventType.site_branch_updated]: ({ site, branch }: EventData.SiteBranchUpdatedEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    return getMattermostMessage(
      `Branch **${branch.name}** from site **${site.name}** was updated.
View it live [here](${getBranchUrl(site, branch)}). ${mainBranchUrl}`.trim(),
    );
  },
  [EventType.site_branch_deleted]: ({ site, branch }: EventData.SiteBranchDeletedEventData) => (
    getMattermostMessage(`Branch **${branch.name}** was removed from site **${site.name}**.`)
  ),
  [EventType.site_branch_release_set]: ({ site, branch, release }: EventData.SiteBranchReleaseSetEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    return getMattermostMessage(
      `The current release of branch **${branch.name}** from site **${site.name}** was set to **${release.name}**.
View it live [here](${getBranchUrl(site, branch)}). ${mainBranchUrl}`.trim(),
    );
  },
  [EventType.site_branch_password_set]: ({ site, branch }: EventData.SiteBranchPasswordSetEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    return getMattermostMessage(
      `Branch **${branch.name}** from site **${site.name}** is now protected by **password**.
View it live [here](${getBranchUrl(site, branch)}). ${mainBranchUrl}`.trim(),
    );
  },
  [EventType.site_branch_password_removed]: ({ site, branch }: EventData.SiteBranchPasswordRemovedEventData) => {
    const isMainBranch = site.mainBranch === branch._id;
    const mainBranchUrl = isMainBranch ? `This is the **main** branch, also live [here](${getSiteUrl(site)}).` : '';
    return getMattermostMessage(
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
    return getMattermostMessage(message.trim());
  },
};
