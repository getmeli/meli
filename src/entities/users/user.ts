import { AppDb } from '../../db/db';
import { ApiToken } from '../api/api-token';

export interface User {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  authProvider: string;
  externalUserId: any;
  name: string;
  email: string;
  tokens?: ApiToken[];
  invalidateTokensAt?: number;
  hooks: string[];
}

export const Users = () => AppDb.db.collection<User>('users');
