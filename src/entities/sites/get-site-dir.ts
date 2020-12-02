import { join } from 'path';
import { env } from '../../env';
import { Branch } from './branch';
import { Release } from '../releases/release';
import { Redirect } from './redirect';
import { base64Encode } from '../../commons/utils/base64';

export function getSiteDir(siteId: string): string {
  return join(env.MELI_SITES_DIR, siteId);
}

// releases

export function getReleasesDir(siteId: string): string {
  return join(getSiteDir(siteId), 'releases');
}

export function getReleaseDir(release: Release): string {
  return join(getReleasesDir(release.siteId), release._id);
}

// branches

export function getBranchesDir(siteId: string): string {
  return join(env.MELI_SITES_DIR, siteId, 'branches');
}

export function getBranchDir(siteId: string, branch: Branch): string {
  return join(getBranchesDir(siteId), branch._id);
}

export function getBranchStaticDir(siteId: string, branch: Branch): string {
  return join(getBranchesDir(siteId), branch._id, 'static');
}

export function getBranchFilesDir(siteId: string, branch: Branch): string {
  return join(getBranchesDir(siteId), branch._id, 'dynamic');
}

export function getFileRedirectFileName(redirect: Redirect) {
  return base64Encode(redirect.path);
}

export function getBranchFilePath(siteId: string, branch: Branch, redirect: Redirect): string {
  return join(getBranchFilesDir(siteId, branch), getFileRedirectFileName(redirect));
}
