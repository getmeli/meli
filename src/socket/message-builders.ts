import * as EventData from '../events/event-data';
import { Site } from '../entities/sites/site';
import { EventType } from '../events/event-type';
import { getSiteUrl } from '../entities/sites/get-site-url';
import { getBranchUrl } from '../entities/sites/get-branch-url';
import { Branch } from '../entities/sites/branch';
import { Team } from '../entities/teams/team';
import { Release } from '../entities/releases/release';
import { serializeForm } from '../entities/forms/serialize-form';

function serializeTeam(team: Team) {
  return {
    _id: team._id,
    orgId: team.orgId,
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
    redirects: branch.redirects?.map(redirect => ({
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

function serializeRelease(release: Release) {
  return {
    _id: release._id,
    siteId: release.siteId,
    name: release.name,
    date: release.date,
    branches: release.branches,
    forms: release.forms?.map(serializeForm),
  };
}

export const messageBuilders: Partial<{
  [eventType in keyof EventData.EventData]: (data: any) => {
    room: string;
    data: any;
  }
}> = {
  [EventType.site_added]: ({ team, site }: EventData.TeamSiteAddedEventData) => ({
    room: `team.${team._id}`,
    data: {
      team: serializeTeam(team),
      site: serializeSite(site),
    },
  }),
  [EventType.site_deleted]: ({ site }: EventData.SiteDeletedEventData) => ({
    room: `site.${site._id}`,
    data: {
      site: serializeSite(site),
    },
  }),
  [EventType.site_release_created]: ({ site, release }: EventData.SiteReleaseCreatedEventData) => ({
    room: `site.${site._id}`,
    data: {
      release: serializeRelease(release),
    },
  }),
  [EventType.team_added]: ({ team }: EventData.TeamEventData) => ({
    room: `org.${team.orgId}`,
    data: {
      team: serializeTeam(team),
    },
  }),
  [EventType.team_deleted]: ({ team }: EventData.TeamEventData) => ({
    room: `team.${team._id}`,
    data: {
      team: serializeTeam(team),
    },
  }),
};
