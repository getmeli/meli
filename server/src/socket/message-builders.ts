import * as EventData from '../events/event-data';
import { Site } from '../entities/sites/site';
import { EventType } from '../events/event-type';
import { getSiteUrl } from '../entities/sites/get-site-url';
import { getBranchUrl } from '../entities/sites/get-branch-url';
import { Branch } from '../entities/sites/branch';
import { Project } from '../entities/projects/project';
import { Release } from '../entities/releases/release';
import { serializeForm } from '../entities/forms/serialize-form';

function serializeProject(project: Project) {
  return {
    _id: project._id,
    orgId: project.orgId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    name: project.name,
    color: project.color,
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
    projectId: site.projectId,
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
  [EventType.site_added]: ({ project, site }: EventData.ProjectSiteAddedEventData) => ({
    room: `project.${project._id}`,
    data: {
      project: serializeProject(project),
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
  [EventType.project_added]: ({ project }: EventData.ProjectEventData) => ({
    room: `org.${project.orgId}`,
    data: {
      project: serializeProject(project),
    },
  }),
  [EventType.project_deleted]: ({ project }: EventData.ProjectEventData) => ({
    room: `project.${project._id}`,
    data: {
      project: serializeProject(project),
    },
  }),
};
