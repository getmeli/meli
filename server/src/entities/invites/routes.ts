import { Router } from 'express';
import { getInvite } from './handlers/get-invite';
import { acceptInvite } from './handlers/accept-invite';
import { declineInvite } from './handlers/decline-invite';
import { ApiScope } from '../api/api-scope';
import { apiEndpoint } from '../api/api-endpoint';

const router = Router();

// invites
apiEndpoint({
  name: 'get invite',
  method: 'post',
  path: '/api/v1/invites/:token',
  handler: getInvite,
  auth: true,
  apiScope: ApiScope.invite_read,
  router,
});
apiEndpoint({
  name: 'accept invite',
  method: 'put',
  path: '/api/v1/invites/:inviteId/accept',
  handler: acceptInvite,
  auth: true,
  apiScope: ApiScope.invite_accept,
  router,
});
apiEndpoint({
  name: 'decline invite',
  method: 'put',
  path: '/api/v1/invites/:inviteId/decline',
  handler: declineInvite,
  auth: true,
  apiScope: ApiScope.invite_decline,
  router,
});

export default router;
