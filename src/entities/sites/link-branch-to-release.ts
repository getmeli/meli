import { Site } from './site';
import { Branch } from './branch';
import { Release } from '../releases/release';
import { getBranchDir, getBranchStaticDir, getReleaseDir } from './get-site-dir';
import { promises as fs } from 'fs';
import { dirname, relative } from 'path';
import { Logger } from '../../commons/logger/logger';

const logger = new Logger('meli.api:linkBranchToRelease');

export async function linkBranchToRelease(site: Site, branch: Branch, release: Release): Promise<void> {
  const releasePath = getReleaseDir(release);
  const branchesDir = getBranchDir(site._id, branch);
  const branchStaticDir = getBranchStaticDir(site._id, branch);

  logger.debug('releaseDirectory', releasePath);
  logger.debug('channelPath', branchStaticDir);
  logger.debug('creating recursive branches dir', branchesDir);

  await fs.mkdir(branchesDir, {
    recursive: true,
  });

  try {
    await fs.unlink(branchStaticDir);
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  const symlinkPath = relative(dirname(branchStaticDir), releasePath);

  logger.debug('creating symlink', branchStaticDir, '->', symlinkPath);

  await fs.symlink(symlinkPath, branchStaticDir, 'dir');
}
