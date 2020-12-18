import { join, relative, resolve } from 'path';
import { env } from '../../env/env';
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

export function getBranchDir(siteId: string, branchId: string): string {
  return join(getBranchesDir(siteId), branchId);
}

export function getBranchStaticDir(siteId: string, branchId: string): string {
  return join(getBranchesDir(siteId), branchId, 'static');
}

export function getBranchFilesDir(siteId: string, branchId: string): string {
  return join(getBranchesDir(siteId), branchId, 'dynamic');
}

export function getFileRedirectFileName(redirect: Redirect) {
  return base64Encode(redirect.path);
}

export function getBranchFilePath(siteId: string, branchId: string, redirect: Redirect): string {
  return join(getBranchFilesDir(siteId, branchId), getFileRedirectFileName(redirect));
}

// inside caddy

export function getBranchDirInCaddy(siteId: string, branchId: string) {
  const branchStaticDir = getBranchStaticDir(siteId, branchId);
  return resolve(env.MELI_CADDY_DIR, relative(env.MELI_SITES_DIR, branchStaticDir));
}

export function getBranchFileRedirectDirInCaddy(siteId: string, branchId: string) {
  const branchFilesDir = getBranchFilesDir(siteId, branchId);
  return resolve(env.MELI_CADDY_DIR, relative(env.MELI_SITES_DIR, branchFilesDir));
}
