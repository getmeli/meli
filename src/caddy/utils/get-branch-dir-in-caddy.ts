import { relative, resolve } from 'path';
import { env } from '../../env';
import { getBranchStaticDir } from '../../entities/sites/get-site-dir';
import { Branch } from '../../entities/sites/branch';

export function getBranchDirInCaddy(siteId: string, branch: Branch) {
  const branchStaticDir = getBranchStaticDir(siteId, branch);
  return resolve(env.MELI_CADDY_DIR, relative(env.MELI_SITES_DIR, branchStaticDir));
}
