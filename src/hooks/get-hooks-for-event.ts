import { EventData, OrgEventData, SiteEventData, TeamEventData, UserEventData } from '../events/event-data';
import { EventType } from '../events/event-type';
import { Org, Orgs } from '../entities/orgs/org';
import { Team, Teams } from '../entities/teams/team';
import { User, Users } from '../entities/users/user';
import { Site } from '../entities/sites/site';

/*
 * org event:
 *    org hooks => org + data
 * team event:
 *    org hook => org + team + data
 *    team hook => org + team + data
 * site event:
 *    org hook => org + team + site + data
 *    team hook => org + team + site + data
 *    site hook => org + team + site + data
 */
export async function getHooksForEvent<T extends keyof EventData>(eventType: T, data: EventData[T]): Promise<string[]> {
  let org: Org;
  let team: Team;
  let site: Site;
  let owner: User;
  switch (eventType) {
    case EventType.user_api_token_created:
    case EventType.user_api_token_updated:
    case EventType.user_api_token_deleted:
    case EventType.user_org_created:
      return (data as UserEventData).user.hooks;
    case EventType.org_updated:
    case EventType.org_invite_added:
    case EventType.org_invite_deleted:
    case EventType.org_invite_accepted:
    case EventType.org_invite_declined:
    case EventType.org_member_joined:
    case EventType.org_member_updated:
    case EventType.org_member_deleted:
    case EventType.org_hook_created:
    case EventType.org_hook_updated:
    case EventType.org_hook_deleted:
    case EventType.org_team_added:
      org = (data as OrgEventData).org;
      owner = await Users().findOne({
        _id: org.ownerId,
      });
      return [
        ...(org.hooks || []),
        ...(owner.hooks || []),
      ];
    case EventType.team_updated:
    case EventType.team_deleted:
    case EventType.team_member_added:
    case EventType.team_member_deleted:
    case EventType.team_hook_created:
    case EventType.team_hook_updated:
    case EventType.team_hook_deleted:
    case EventType.team_site_added:
      team = (data as TeamEventData).team;
      org = await Orgs().findOne({
        _id: team.orgId,
      });
      owner = await Users().findOne({
        _id: org.ownerId,
      });
      return [
        ...(team.hooks || []),
        ...(org.hooks || []),
        ...(owner.hooks || []),
      ];
    case EventType.site_updated:
    case EventType.site_deleted:
    case EventType.site_hook_created:
    case EventType.site_hook_updated:
    case EventType.site_hook_deleted:
    case EventType.site_token_added:
    case EventType.site_token_deleted:
    case EventType.site_release_created:
    case EventType.site_release_renamed:
    case EventType.site_release_deleted:
    case EventType.site_branch_added:
    case EventType.site_branch_updated:
    case EventType.site_branch_deleted:
    case EventType.site_branch_release_set:
      site = (data as SiteEventData).site;
      team = await Teams().findOne({
        _id: site.teamId,
      });
      org = await Orgs().findOne({
        _id: team.orgId,
      });
      owner = await Users().findOne({
        _id: org.ownerId,
      });
      return [
        ...(site.hooks || []),
        ...(team.hooks || []),
        ...(org.hooks || []),
        ...(owner.hooks || []),
      ];
    default:
      return [];
  }
}
