import { Release } from './release';

export function serializeRelease(release: Release) {
  return {
    _id: release._id,
    date: release.date,
    name: release.name,
    siteId: release.siteId,
    branches: release.branches || [],
  };
}
