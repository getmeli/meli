import { ApiToken } from './api-token';

export function serializeApiToken(token: ApiToken) {
  return !token ? undefined : {
    _id: token._id,
    name: token.name,
    value: token.value,
    scopes: token.scopes || [],
    expiresAt: token.expiresAt,
    activatesAt: token.activatesAt,
    createdAt: token.createdAt,
    updatedAt: token.updatedAt,
  };
}
