import { Router } from 'express';
import { deleteSite } from './handlers/delete-site';
import { getSite } from './handlers/get-site';
import { uploadRelease } from './handlers/releases/upload-release';
import { updateSite } from './handlers/update-site';
import { validateSiteName } from './handlers/validate-site-name';
import { deleteToken } from './handlers/tokens/delete-token';
import { addToken } from './handlers/tokens/add-token';
import { listTokens } from './handlers/tokens/list-tokens';
import { listSiteReleases } from './handlers/releases/list-site-releases';
import { listBranches } from './handlers/branches/list-branches';
import { addBranch } from './handlers/branches/add-branch';
import { deleteBranch } from './handlers/branches/delete-branch';
import { renameBranch } from './handlers/branches/rename-branch';
import { validateBranchName } from './handlers/branches/validate-branch-name';
import { setBranchRelease } from './handlers/branches/set-branch-release';
import { apiEndpoint } from '../api/api-endpoint';
import { ApiScope } from '../api/api-scope';
import { listSiteHooks } from './handlers/hooks/list-site-hooks';
import { createSiteHook } from './handlers/hooks/create-site-hook';
import { deleteSiteHook } from './handlers/hooks/delete-site-hook';
import { updateSiteHook } from './handlers/hooks/update-site-hook';
import { listSiteEvents } from './handlers/hooks/list-site-events';
import { getSiteHook } from './handlers/hooks/get-site-hook';
import { listSiteHookDeliveries } from './handlers/hooks/list-site-hook-deliveries';
import { setBranchPassword } from './handlers/branches/set-branch-password';
import { removeBranchPassword } from './handlers/branches/remove-branch-password';
import { listBranchRedirects } from './handlers/branches/list-branch-redirects';
import { setBranchRedirects } from './handlers/branches/set-branch-redirects';
import { getBranch } from './handlers/branches/get-branch';
import { setSitePassword } from './handlers/set-site-password';
import { removeSitePassword } from './handlers/remove-site-password';
import { removeSiteLogo } from './handlers/remove-site-logo';
import { setSiteLogo } from './handlers/set-site-logo';
import { getSiteLogo } from './handlers/get-site-logo';
import { setBranchHeaders } from './handlers/branches/set-branch-headers';
import { setSiteHeaders } from './set-site-headers';
import { submitForm } from '../releases/handlers/submit-form';

const router = Router();

apiEndpoint({
  name: 'validate site name',
  method: 'post',
  path: '/api/v1/sites.validate/name',
  handler: validateSiteName,
  auth: true,
  apiScope: ApiScope.site_name_validate,
  router,
});

// sites
apiEndpoint({
  name: 'get site',
  method: 'get',
  path: '/api/v1/sites/:siteId',
  handler: getSite,
  auth: true,
  apiScope: ApiScope.site_read,
  router,
});
apiEndpoint({
  name: 'update site',
  method: 'put',
  path: '/api/v1/sites/:siteId',
  handler: updateSite,
  auth: true,
  apiScope: ApiScope.site_update,
  router,
});
apiEndpoint({
  name: 'delete site',
  method: 'delete',
  path: '/api/v1/sites/:siteId',
  handler: deleteSite,
  auth: true,
  apiScope: ApiScope.site_delete,
  router,
});
apiEndpoint({
  name: 'set site headers',
  method: 'put',
  path: '/api/v1/sites/:siteId/headers',
  handler: setSiteHeaders,
  auth: true,
  apiScope: ApiScope.site_headers_set,
  router,
});

// logo
apiEndpoint({
  name: 'set site logo',
  method: 'post',
  path: '/api/v1/sites/:siteId/logo',
  handler: setSiteLogo,
  auth: true,
  apiScope: ApiScope.site_logo_set,
  router,
});
apiEndpoint({
  name: 'remove site logo',
  method: 'delete',
  path: '/api/v1/sites/:siteId/logo',
  handler: removeSiteLogo,
  auth: true,
  apiScope: ApiScope.site_logo_remove,
  router,
});
apiEndpoint({
  name: 'get site logo',
  method: 'get',
  path: '/api/v1/sites/:siteId/logo',
  handler: getSiteLogo,
  auth: true,
  apiScope: ApiScope.site_logo_get,
  router,
});

// password
apiEndpoint({
  name: 'set site password',
  method: 'put',
  path: '/api/v1/sites/:siteId/password',
  handler: setSitePassword,
  auth: true,
  apiScope: ApiScope.site_update,
  router,
});
apiEndpoint({
  name: 'remove password',
  method: 'delete',
  path: '/api/v1/sites/:siteId/password',
  handler: removeSitePassword,
  auth: true,
  apiScope: ApiScope.site_update,
  router,
});

// releases
apiEndpoint({
  name: 'list site releases',
  method: 'get',
  path: '/api/v1/sites/:siteId/releases',
  handler: listSiteReleases,
  auth: true,
  apiScope: ApiScope.site_releases_list,
  router,
});
apiEndpoint({
  name: 'upload release',
  method: 'post',
  path: '/api/v1/sites/:siteId/releases',
  handler: uploadRelease,
  apiScope: ApiScope.release_upload,
  router,
});

// tokens
apiEndpoint({
  name: 'list tokens',
  method: 'get',
  path: '/api/v1/sites/:siteId/tokens',
  handler: listTokens,
  auth: true,
  router,
});
apiEndpoint({
  name: 'add token',
  method: 'post',
  path: '/api/v1/sites/:siteId/tokens',
  handler: addToken,
  auth: true,
  router,
});
apiEndpoint({
  name: 'delete token',
  method: 'delete',
  path: '/api/v1/sites/:siteId/tokens/:tokenId',
  handler: deleteToken,
  auth: true,
  router,
});

// branches
apiEndpoint({
  name: 'validate branch name',
  method: 'post',
  path: '/api/v1/sites/:siteId/branches.validate/name',
  handler: validateBranchName,
  auth: true,
  apiScope: ApiScope.site_branch_name_validate,
  router,
});
apiEndpoint({
  name: 'list branches',
  method: 'get',
  path: '/api/v1/sites/:siteId/branches',
  handler: listBranches,
  auth: true,
  apiScope: ApiScope.site_branch_list,
  router,
});
apiEndpoint({
  name: 'add branch',
  method: 'post',
  path: '/api/v1/sites/:siteId/branches',
  handler: addBranch,
  auth: true,
  apiScope: ApiScope.site_branch_add,
  router,
});
apiEndpoint({
  name: 'get branch',
  method: 'get',
  path: '/api/v1/sites/:siteId/branches/:branchId',
  handler: getBranch,
  auth: true,
  apiScope: ApiScope.site_branch_read,
  router,
});
apiEndpoint({
  name: 'delete branch',
  method: 'delete',
  path: '/api/v1/sites/:siteId/branches/:branchId',
  handler: deleteBranch,
  auth: true,
  apiScope: ApiScope.site_branch_delete,
  router,
});
apiEndpoint({
  name: 'rename branch',
  method: 'put',
  path: '/api/v1/sites/:siteId/branches/:branchId/name',
  handler: renameBranch,
  auth: true,
  apiScope: ApiScope.site_branch_rename,
  router,
});
apiEndpoint({
  name: 'set branch release',
  method: 'put',
  path: '/api/v1/sites/:siteId/branches/:branchId/release',
  handler: setBranchRelease,
  auth: true,
  apiScope: ApiScope.site_branch_release_set,
  router,
});
apiEndpoint({
  name: 'set branch password',
  method: 'put',
  path: '/api/v1/sites/:siteId/branches/:branchId/password',
  handler: setBranchPassword,
  auth: true,
  apiScope: ApiScope.site_branch_password_set,
  router,
});
apiEndpoint({
  name: 'remove branch password',
  method: 'delete',
  path: '/api/v1/sites/:siteId/branches/:branchId/password',
  handler: removeBranchPassword,
  auth: true,
  apiScope: ApiScope.site_branch_password_remove,
  router,
});
apiEndpoint({
  name: 'get branch redirects',
  method: 'get',
  path: '/api/v1/sites/:siteId/branches/:branchId/redirects',
  handler: listBranchRedirects,
  auth: true,
  apiScope: ApiScope.site_branch_redirects_read,
  router,
});
apiEndpoint({
  name: 'set branch redirects',
  method: 'put',
  path: '/api/v1/sites/:siteId/branches/:branchId/redirects',
  handler: setBranchRedirects,
  auth: true,
  apiScope: ApiScope.site_branch_redirects_set,
  router,
});
apiEndpoint({
  name: 'set branch headers',
  method: 'put',
  path: '/api/v1/sites/:siteId/branches/:branchId/headers',
  handler: setBranchHeaders,
  auth: true,
  apiScope: ApiScope.site_branch_headers_set,
  router,
});

// hooks
apiEndpoint({
  name: 'list site hook events',
  method: 'get',
  path: '/api/v1/sites/:siteId/hook-events',
  handler: listSiteEvents,
  auth: true,
  router,
});
apiEndpoint({
  name: 'list site hooks',
  method: 'get',
  path: '/api/v1/sites/:siteId/hooks',
  handler: listSiteHooks,
  auth: true,
  apiScope: ApiScope.site_hook_list,
  router,
});
apiEndpoint({
  name: 'create site hook',
  method: 'post',
  path: '/api/v1/sites/:siteId/hooks',
  handler: createSiteHook,
  auth: true,
  apiScope: ApiScope.site_hook_create,
  router,
});
apiEndpoint({
  name: 'get site hook',
  method: 'get',
  path: '/api/v1/sites/:siteId/hooks/:hookId',
  handler: getSiteHook,
  auth: true,
  apiScope: ApiScope.site_hook_read,
  router,
});
apiEndpoint({
  name: 'update site hook',
  method: 'put',
  path: '/api/v1/sites/:siteId/hooks/:hookId',
  handler: updateSiteHook,
  auth: true,
  apiScope: ApiScope.site_hook_update,
  router,
});
apiEndpoint({
  name: 'delete site hook',
  method: 'delete',
  path: '/api/v1/sites/:siteId/hooks/:hookId',
  handler: deleteSiteHook,
  auth: true,
  apiScope: ApiScope.site_hook_delete,
  router,
});
apiEndpoint({
  name: 'list site hook deliveries',
  method: 'get',
  path: '/api/v1/sites/:siteId/hooks/:hookId/deliveries',
  handler: listSiteHookDeliveries,
  auth: true,
  apiScope: ApiScope.site_hook_read,
  router,
});

// forms

apiEndpoint({
  name: 'submit a form',
  method: 'post',
  path: '/api/v1/sites/:siteId/branches/:branchId/forms/:formName',
  handler: submitForm,
  apiScope: ApiScope.form_submit,
  router,
});

export default router;
