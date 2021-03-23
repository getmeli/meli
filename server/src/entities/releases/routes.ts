import { Router } from 'express';
import { updateRelease } from './handlers/update-release';
import { deleteRelease } from './handlers/delete-release';
import { getRelease } from './handlers/get-release';
import { apiEndpoint } from '../api/api-endpoint';
import { ApiScope } from '../api/api-scope';
import { updateForms } from './handlers/update-forms';

const router = Router();

apiEndpoint({
  name: 'get release',
  method: 'get',
  path: '/api/v1/releases/:releaseId',
  handler: getRelease,
  auth: true,
  apiScope: ApiScope.release_read,
  router,
});
apiEndpoint({
  name: 'update release',
  method: 'put',
  path: '/api/v1/releases/:releaseId',
  handler: updateRelease,
  auth: true,
  apiScope: ApiScope.release_update,
  router,
});
apiEndpoint({
  name: 'update release',
  method: 'put',
  path: '/api/v1/releases/:releaseId/forms',
  handler: updateForms,
  auth: true,
  apiScope: ApiScope.form_update,
  router,
});
apiEndpoint({
  name: 'delete release',
  method: 'delete',
  path: '/api/v1/releases/:releaseId',
  handler: deleteRelease,
  auth: true,
  apiScope: ApiScope.release_delete,
  router,
});

export default router;
