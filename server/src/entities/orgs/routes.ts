import { Router } from 'express';
import { updateOrg } from './handlers/update-org';
import { listOrgs } from './handlers/list-orgs';
import { listMembers } from './handlers/members/list-members';
import { listProjects } from './handlers/projects/list-projects';
import { createProject } from './handlers/projects/create-project';
import { getOrg } from './handlers/get-org';
import { getCurrentOrgMember } from './handlers/members/get-current-org-member';
import { listInvites } from './handlers/invites/list-invites';
import { addInvite } from './handlers/invites/add-invite';
import { deleteInvite } from './handlers/invites/delete-invite';
import { createOrg } from './handlers/create-org';
import { apiEndpoint } from '../api/api-endpoint';
import { ApiScope } from '../api/api-scope';
import { listSites } from './handlers/sites/list-sites';
import { setOrgLogo } from './handlers/set-org-logo';
import { removeOrgLogo } from './handlers/remove-org-logo';
import { getOrgLogo } from './handlers/get-org-logo';

const router = Router();

// orgs
apiEndpoint({
  name: 'create org',
  method: 'post',
  path: '/api/v1/orgs',
  handler: createOrg,
  auth: true,
  apiScope: ApiScope.org_create,
  router,
});
apiEndpoint({
  name: 'list orgs',
  method: 'get',
  path: '/api/v1/orgs',
  handler: listOrgs,
  auth: true,
  apiScope: ApiScope.org_list,
  router,
});
apiEndpoint({
  name: 'get org',
  method: 'get',
  path: '/api/v1/orgs/:orgId',
  handler: getOrg,
  auth: true,
  apiScope: ApiScope.org_read,
  router,
});
apiEndpoint({
  name: 'update org',
  method: 'put',
  path: '/api/v1/orgs/:orgId',
  handler: updateOrg,
  auth: true,
  apiScope: ApiScope.org_update,
  router,
});

// logo
apiEndpoint({
  name: 'set org logo',
  method: 'post',
  path: '/api/v1/orgs/:orgId/logo',
  handler: setOrgLogo,
  auth: true,
  apiScope: ApiScope.org_logo_set,
  router,
});
apiEndpoint({
  name: 'remove org logo',
  method: 'delete',
  path: '/api/v1/orgs/:orgId/logo',
  handler: removeOrgLogo,
  auth: true,
  apiScope: ApiScope.org_logo_remove,
  router,
});
apiEndpoint({
  name: 'get org logo',
  method: 'get',
  path: '/api/v1/orgs/:orgId/logo',
  handler: getOrgLogo,
  auth: true,
  apiScope: ApiScope.org_logo_get,
  router,
});
// TODO delete

// invites
apiEndpoint({
  name: 'list invite',
  method: 'get',
  path: '/api/v1/orgs/:orgId/invites',
  handler: listInvites,
  auth: true,
  apiScope: ApiScope.invite_list,
  router,
});
apiEndpoint({
  name: 'add invite',
  method: 'post',
  path: '/api/v1/orgs/:orgId/invites',
  handler: addInvite,
  auth: true,
  apiScope: ApiScope.invite_add,
  router,
});
apiEndpoint({
  name: 'delete invite',
  method: 'delete',
  path: '/api/v1/orgs/:orgId/invites/:inviteId',
  handler: deleteInvite,
  auth: true,
  apiScope: ApiScope.invite_delete,
  router,
});

// members
apiEndpoint({
  name: 'get current',
  method: 'get',
  path: '/api/v1/orgs/:orgId/member',
  handler: getCurrentOrgMember,
  auth: true,
  apiScope: ApiScope.member_get_current,
  router,
});
apiEndpoint({
  name: 'list member',
  method: 'get',
  path: '/api/v1/orgs/:orgId/members',
  handler: listMembers,
  auth: true,
  apiScope: ApiScope.members_list,
  router,
});

// projects
apiEndpoint({
  name: 'list projects',
  method: 'get',
  path: '/api/v1/orgs/:orgId/projects',
  handler: listProjects,
  auth: true,
  apiScope: ApiScope.project_list,
  router,
});
apiEndpoint({
  name: 'create project',
  method: 'post',
  path: '/api/v1/orgs/:orgId/projects',
  handler: createProject,
  auth: true,
  apiScope: ApiScope.project_create,
  router,
});

// sites
apiEndpoint({
  name: 'list sites',
  method: 'get',
  path: '/api/v1/orgs/:orgId/sites',
  handler: listSites,
  auth: true,
  apiScope: ApiScope.sites_list,
  router,
});

export default router;
