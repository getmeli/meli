import { ApiScope } from './api-scope';
import { RequestHandler, Router } from 'express';
import { authGuard } from '../../auth/guards/auth-guard';
import { apiGuard } from '../../auth/guards/api-guard';

export interface ApiEndpoint {
  name: string;
  method: 'get' | 'put' | 'post' | 'delete';
  path: string;
  handler: RequestHandler[];
  auth?: boolean;
  apiScope?: ApiScope;
  router: Router;
}

export const apiEndpoints: ApiEndpoint[] = [];

export function apiEndpoint(endpoint: ApiEndpoint) {
  const {
    router, method, path, handler, auth, apiScope,
  } = endpoint;

  // register endpoint
  router[method](path, [
    ...(auth ? [authGuard] : []),
    ...(apiScope && apiScope.length !== 0 ? [apiGuard(apiScope)] : []),
    ...handler,
  ]);

  // document endpoint
  apiEndpoints.push(endpoint);
}
