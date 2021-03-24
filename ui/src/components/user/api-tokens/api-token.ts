import { ApiScope } from './api-scope';

export interface ApiToken {
  _id: string;
  name: string;
  value: string;
  scopes: ApiScope[];
  expiresAt: Date;
  activatesAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
