import { Router } from 'express';
import { getUserHandler } from './handlers/get-user-handler';
import { apiEndpoint } from '../api/api-endpoint';
import { ApiScope } from '../api/api-scope';
import { invalidateTokens } from './handlers/invalidate-tokens';

const router = Router();

apiEndpoint({
  name: 'get user route',
  method: 'get',
  path: '/api/v1/user',
  handler: getUserHandler,
  auth: false,
  apiScope: ApiScope.user_read,
  router,
});
apiEndpoint({
  name: 'disconnect user from all devices',
  method: 'put',
  path: '/api/v1/user/disconnect',
  handler: invalidateTokens,
  auth: true,
  apiScope: ApiScope.user_disconnect,
  router,
});

export default router;
