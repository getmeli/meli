import { Router } from 'express';
import { updateMember } from './handlers/update-member';
import { deleteMember } from './handlers/delete-member';
import { apiEndpoint } from '../api/api-endpoint';
import { ApiScope } from '../api/api-scope';

const router = Router();

// members
apiEndpoint({
  name: 'update member',
  method: 'put',
  path: '/api/v1/members/:memberId',
  handler: updateMember,
  auth: true,
  apiScope: ApiScope.member_update,
  router,
});
apiEndpoint({
  name: 'delete member',
  method: 'delete',
  path: '/api/v1/members/:memberId',
  handler: deleteMember,
  auth: true,
  apiScope: ApiScope.member_delete,
  router,
});

export default router;
