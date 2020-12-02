import { Router } from 'express';
import { createApiToken } from './handlers/tokens/create-api-token';
import { listApiTokens } from './handlers/tokens/list-api-tokens';
import { deleteApiToken } from './handlers/tokens/delete-api-token';
import { listApiEndpoints } from './handlers/endpoints/list-api-endpoints';
import { updateApiToken } from './handlers/tokens/update-api-token';
import { apiEndpoint } from './api-endpoint';
import { getApiToken } from './handlers/tokens/get-api-token';

const router = Router();

apiEndpoint({
  name: 'list api endpoints',
  method: 'get',
  path: '/api/v1/api-endpoints',
  handler: listApiEndpoints,
  auth: true,
  router,
});
apiEndpoint({
  name: 'list api tokens',
  method: 'get',
  path: '/api/v1/api-tokens',
  handler: listApiTokens,
  auth: true,
  router,
});
apiEndpoint({
  name: 'create api token',
  method: 'post',
  path: '/api/v1/api-tokens',
  handler: createApiToken,
  auth: true,
  router,
});
apiEndpoint({
  name: 'get api token',
  method: 'get',
  path: '/api/v1/api-tokens/:apiTokenId',
  handler: getApiToken,
  auth: true,
  router,
});
apiEndpoint({
  name: 'update api token',
  method: 'put',
  path: '/api/v1/api-tokens/:apiTokenId',
  handler: updateApiToken,
  auth: true,
  router,
});
apiEndpoint({
  name: 'delete api token',
  method: 'delete',
  path: '/api/v1/api-tokens/:apiTokenId',
  handler: deleteApiToken,
  auth: true,
  router,
});

export default router;
