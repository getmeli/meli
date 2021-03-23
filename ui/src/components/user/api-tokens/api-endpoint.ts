import { HttpMethod } from './HttpMethodBadge';
import { ApiScope } from './api-scope';

export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  auth: boolean;
  apiScope: ApiScope;
}
