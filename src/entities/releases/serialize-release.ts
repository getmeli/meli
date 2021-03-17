import { Release } from './release';
import { serializeForm } from '../forms/serialize-form';

export function serializeRelease(release: Release) {
  return {
    _id: release._id,
    date: release.date,
    name: release.name,
    siteId: release.siteId,
    branches: release.branches || [],
    forms: release.forms.map(serializeForm) || [],
  };
}
