import { Request, Response } from 'express';
import tar from 'tar';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Release, Releases } from '../../../releases/release';
import { upload } from '../../../../upload';
import { getBranchDir, getReleaseDir } from '../../get-site-dir';
import { Site, Sites } from '../../site';
import { siteExistsGuard } from '../../guards/site-exists-guard';
import { canUploadReleaseGuard } from '../../guards/can-upload-release-guard';
import { emitEvent } from '../../../../events/emit-event';
import { serializeRelease } from '../../../releases/serialize-release';
import { uuid } from '../../../../utils/uuid';
import { EventType } from '../../../../events/event-type';
import { Branch } from '../../branch';
import { ensureEmptyDirectory } from '../../../../commons/utils/ensure-empty-directory';
import { linkBranchToRelease } from '../../link-branch-to-release';
import { promises } from 'fs';
import { object, string } from 'joi';
import { STRING_MAX_LENGTH } from '../../../../constants';
import { body } from '../../../../commons/express-joi/body';
import slugify from 'slugify';
import { getBranchUrl } from '../../get-branch-url';
import { configureSiteInCaddy } from '../../../../caddy/configuration';
import { Logger } from '../../../../commons/logger/logger';

async function createOrGetBranch(site: Site, branchName: string): Promise<Branch> {
  let branch: Branch = site.branches.find(c => c.name === branchName);

  if (!branch) {
    branch = {
      _id: uuid(),
      name: branchName,
      release: undefined,
      slug: slugify(branchName),
    };

    // save to site
    await Sites().updateOne({
      _id: site._id,
    }, {
      $push: {
        branches: branch,
      },
    });

    // create dir
    const branchDir = getBranchDir(site._id, branch);
    await promises.mkdir(branchDir, {
      recursive: true,
    });
  }

  return branch;
}

async function extractReleaseFiles(releaseDirectory: string, file: Express.Multer.File) {
  await ensureEmptyDirectory(releaseDirectory);
  await tar.extract({
    file: file.path,
    cwd: releaseDirectory,
  });
}

async function setBranchRelease(site: Site, branch: Branch, release: Release): Promise<void> {
  branch.release = release._id;
  await Sites().updateOne({
    _id: site._id,
    'branches._id': branch._id,
  }, {
    $set: {
      'branches.$.release': release._id,
    },
  });
}

const logger = new Logger('meli.api:uploadRelease');

async function handler(req: Request, res: Response): Promise<void> {
  const { file } = req;
  const { siteId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
  });

  const branchNames: string[] = req.body.branches;
  const branches = await Promise.all(
    branchNames.map(branchName => createOrGetBranch(site, branchName)),
  );

  const release: Release = {
    _id: uuid(),
    siteId,
    name: req.body.release || uuid(),
    date: new Date(),
    branches: branches.map(({ _id }) => _id),
  };

  await Releases().insertOne(release);

  const releaseDirectory = getReleaseDir(release);
  await extractReleaseFiles(releaseDirectory, file);

  await Promise.all(
    branches.map(async branch => {
      await setBranchRelease(site, branch, release);
      await linkBranchToRelease(site, branch, release);
    }),
  );

  if (!site.mainBranch) {
    const mainBranch = branches[0]._id;

    await Sites().updateOne({
      _id: siteId,
      mainBranch: null,
    }, {
      $set: {
        mainBranch,
      },
    });

    site.mainBranch = mainBranch;
  }

  configureSiteInCaddy(site).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_release_created, {
    site,
    release,
  });

  res.send({
    release: serializeRelease(release),
    urls: branches.map(branch => getBranchUrl(site, branch)),
  });
}

export const uploadRelease = [
  ...siteExistsGuard,
  ...canUploadReleaseGuard,
  upload.single('file'),
  body(object({
    release: string().optional().max(STRING_MAX_LENGTH),
    branches: string().trim().required().min(1)
      .max(STRING_MAX_LENGTH)
      .custom(str => (
        str.split(',')
      )),
  })),
  wrapAsyncMiddleware(handler),
];
