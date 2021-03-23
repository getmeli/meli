import { SiteToken } from './site';

export function serializeSiteToken(token: SiteToken) {
  return !token ? undefined : {
    _id: token._id,
    name: token.name,
    createdAt: token.createdAt,
    value: token.value,
  };
}
