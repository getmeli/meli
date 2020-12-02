import { ApiEndpoint } from './api-endpoint';

export function serializeEndpoint(endpoint: ApiEndpoint) {
  return {
    method: endpoint.method,
    path: endpoint.path,
    auth: endpoint.auth,
    apiScope: endpoint.apiScope,
  };
}
