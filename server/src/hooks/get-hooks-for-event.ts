import { EventData, OrgEventData, SiteEventData, ProjectEventData, UserEventData } from '../events/event-data';
import { EventType } from '../events/event-type';
import { Org, Orgs } from '../entities/orgs/org';
import { Project, Projects } from '../entities/projects/project';
import { User, Users } from '../entities/users/user';
import { Site } from '../entities/sites/site';

/*
 * org event:
 *    org hooks => org + data
 * project event:
 *    org hook => org + project + data
 *    project hook => org + project + data
 * site event:
 *    org hook => org + project + site + data
 *    project hook => org + project + site + data
 *    site hook => org + project + site + data
 */
export async function getHooksForEvent<T extends keyof EventData>(eventType: T, data: EventData[T]): Promise<string[]> {
  let org: Org;
  let project: Project;
  let site: Site;
  let owner: User;
  switch (eventType) {
    case EventType.user_api_token_created:
    case EventType.user_api_token_updated:
    case EventType.user_api_token_deleted:
    case EventType.org_created:
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
    case EventType.project_added:
      org = (data as OrgEventData).org;
      owner = await Users().findOne({
        _id: org.ownerId,
      });
      return [
        ...(org.hooks || []),
        ...(owner.hooks || []),
      ];
    case EventType.project_updated:
    case EventType.project_deleted:
    case EventType.project_member_added:
    case EventType.project_member_deleted:
    case EventType.project_hook_created:
    case EventType.project_hook_updated:
    case EventType.project_hook_deleted:
    case EventType.site_added:
      project = (data as ProjectEventData).project;
      org = await Orgs().findOne({
        _id: project.orgId,
      });
      owner = await Users().findOne({
        _id: org.ownerId,
      });
      return [
        ...(project.hooks || []),
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
      project = await Projects().findOne({
        _id: site.projectId,
      });
      org = await Orgs().findOne({
        _id: project.orgId,
      });
      owner = await Users().findOne({
        _id: org.ownerId,
      });
      return [
        ...(site.hooks || []),
        ...(project.hooks || []),
        ...(org.hooks || []),
        ...(owner.hooks || []),
      ];
    default:
      return [];
  }
}
