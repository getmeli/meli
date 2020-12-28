import { Router } from 'express';
import { updateTeam } from './handlers/update-team';
import { deleteTeam } from './handlers/delete-team';
import { getTeam } from './handlers/get-team';
import { addMember } from './handlers/members/add-member';
import { deleteMember } from './handlers/members/delete-member';
import { listTeamSites } from './handlers/sites/list-team-sites';
import { listMembers } from './handlers/members/list-members';
import { addSite } from './handlers/sites/add-site';
import { apiEndpoint } from '../api/api-endpoint';
import { ApiScope } from '../api/api-scope';

const router = Router();

// teams
apiEndpoint({
  name: 'get team',
  method: 'get',
  path: '/api/v1/teams/:teamId',
  handler: getTeam,
  auth: true,
  apiScope: ApiScope.team_read,
  router,
});
apiEndpoint({
  name: 'update team',
  method: 'put',
  path: '/api/v1/teams/:teamId',
  handler: updateTeam,
  auth: true,
  apiScope: ApiScope.team_update,
  router,
});
apiEndpoint({
  name: 'delete team',
  method: 'delete',
  path: '/api/v1/teams/:teamId',
  handler: deleteTeam,
  auth: true,
  apiScope: ApiScope.team_delete,
  router,
});

// sites
apiEndpoint({
  name: 'list sites',
  method: 'get',
  path: '/api/v1/teams/:teamId/sites',
  handler: listTeamSites,
  auth: true,
  apiScope: ApiScope.team_sites_list,
  router,
});
apiEndpoint({
  name: 'add site',
  method: 'post',
  path: '/api/v1/teams/:teamId/sites',
  handler: addSite,
  auth: true,
  apiScope: ApiScope.team_sites_add,
  router,
});

// members
apiEndpoint({
  name: 'list members',
  method: 'get',
  path: '/api/v1/teams/:teamId/members',
  handler: listMembers,
  auth: true,
  apiScope: ApiScope.team_member_list,
  router,
});
apiEndpoint({
  name: 'add member',
  method: 'put',
  path: '/api/v1/teams/:teamId/members/:memberId',
  handler: addMember,
  auth: true,
  apiScope: ApiScope.team_member_add,
  router,
});
apiEndpoint({
  name: 'delete member',
  method: 'delete',
  path: '/api/v1/teams/:teamId/members/:memberId',
  handler: deleteMember,
  auth: true,
  apiScope: ApiScope.team_member_delete,
  router,
});

export default router;
