import { array, date, object, string } from 'joi';
import { STRING_MAX_LENGTH } from '../../constants';
import { AppDb } from '../../db/db';
import { ApiScope } from './api-scope';
import { enumToArray } from '../../commons/enum-to-array';

export interface ApiToken {
  _id: string;
  userId: string;
  name: string;
  value: string;
  activatesAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt?: Date;
  scopes: ApiScope[];
}

export const ApiTokens = () => AppDb.db.collection<ApiToken>('api-tokens');

export const $apiToken = object<ApiToken>({
  name: string().required().max(STRING_MAX_LENGTH),
  activatesAt: date().iso().optional().default(new Date()),
  expiresAt: date().iso().optional(),
  scopes: array().required().min(0).items(
    string().valid(...enumToArray(ApiScope)),
  ),
}).custom(value => {
  const { activatesAt, expiresAt } = value;
  if (activatesAt && expiresAt && new Date(activatesAt).getTime() > new Date(expiresAt).getTime()) {
    throw new Error('Token expiration date should be after activation date');
  }
  return value;
});
