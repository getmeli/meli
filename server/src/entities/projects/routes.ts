import { Router } from 'express';
import { updateProject } from './handlers/update-project';
import { deleteProject } from './handlers/delete-project';
import { getProject } from './handlers/get-project';
import { addMember } from './handlers/members/add-member';
import { deleteMember } from './handlers/members/delete-member';
import { listProjectSites } from './handlers/sites/list-project-sites';
import { listMembers } from './handlers/members/list-members';
import { createSite } from './handlers/sites/create-site';
import { apiEndpoint } from '../api/api-endpoint';
import { ApiScope } from '../api/api-scope';
import { setProjectLogo } from './handlers/set-project-logo';
import { removeProjectLogo } from './handlers/remove-project-logo';
import { getProjectLogo } from './handlers/get-project-logo';

const router = Router();

// projects
apiEndpoint({
  name: 'get project',
  method: 'get',
  path: '/api/v1/projects/:projectId',
  handler: getProject,
  auth: true,
  apiScope: ApiScope.project_read,
  router,
});
apiEndpoint({
  name: 'update project',
  method: 'put',
  path: '/api/v1/projects/:projectId',
  handler: updateProject,
  auth: true,
  apiScope: ApiScope.project_update,
  router,
});
apiEndpoint({
  name: 'delete project',
  method: 'delete',
  path: '/api/v1/projects/:projectId',
  handler: deleteProject,
  auth: true,
  apiScope: ApiScope.project_delete,
  router,
});

// logo
apiEndpoint({
  name: 'set project logo',
  method: 'post',
  path: '/api/v1/projects/:projectId/logo',
  handler: setProjectLogo,
  auth: true,
  apiScope: ApiScope.project_logo_set,
  router,
});
apiEndpoint({
  name: 'remove project logo',
  method: 'delete',
  path: '/api/v1/projects/:projectId/logo',
  handler: removeProjectLogo,
  auth: true,
  apiScope: ApiScope.project_logo_remove,
  router,
});
apiEndpoint({
  name: 'get project logo',
  method: 'get',
  path: '/api/v1/projects/:projectId/logo',
  handler: getProjectLogo,
  auth: true,
  apiScope: ApiScope.project_logo_get,
  router,
});

// sites
apiEndpoint({
  name: 'list sites',
  method: 'get',
  path: '/api/v1/projects/:projectId/sites',
  handler: listProjectSites,
  auth: true,
  apiScope: ApiScope.project_sites_list,
  router,
});
apiEndpoint({
  name: 'add site',
  method: 'post',
  path: '/api/v1/projects/:projectId/sites',
  handler: createSite,
  auth: true,
  apiScope: ApiScope.project_sites_add,
  router,
});

// members
apiEndpoint({
  name: 'list members',
  method: 'get',
  path: '/api/v1/projects/:projectId/members',
  handler: listMembers,
  auth: true,
  apiScope: ApiScope.project_member_list,
  router,
});
apiEndpoint({
  name: 'add member',
  method: 'put',
  path: '/api/v1/projects/:projectId/members/:memberId',
  handler: addMember,
  auth: true,
  apiScope: ApiScope.project_member_add,
  router,
});
apiEndpoint({
  name: 'delete member',
  method: 'delete',
  path: '/api/v1/projects/:projectId/members/:memberId',
  handler: deleteMember,
  auth: true,
  apiScope: ApiScope.project_member_delete,
  router,
});

export default router;
