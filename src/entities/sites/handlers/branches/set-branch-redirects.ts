import { Request, Response } from 'express';
import { Sites } from '../../site';
import { emitEvent } from '../../../../events/emit-event';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { body } from '../../../../commons/express-joi/body';
import { array, object, string } from 'joi';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { EventType } from '../../../../events/event-type';
import { branchExistsGuard } from '../../guards/branch-exists-guard';
import { params } from '../../../../commons/express-joi/params';
import { $id } from '../../../../utils/id';
import { updateBranchInCaddy } from '../../../../caddy/configuration';
import { ARRAY_MAX } from '../../../../constants';
import { promises } from 'fs';
import { getBranchFilePath, getBranchFilesDir } from '../../get-site-dir';
import { Branch } from '../../branch';
import { serializeRedirect } from '../../serialize-redirect';
import { $redirect, FileRedirectConfig, Redirect, RedirectType } from '../../redirect';
import { Logger } from '../../../../commons/logger/logger';

async function storeBranchFilesToFs(siteId: string, branch: Branch, redirects: Redirect<FileRedirectConfig>[]) {
  const dir = getBranchFilesDir(siteId, branch._id);
  await promises.mkdir(dir, {
    recursive: true,
  });
  await Promise.all(redirects.map(async redirect => {
    const path = getBranchFilePath(siteId, branch._id, redirect);
    await promises.writeFile(path, redirect.config.content);
  }));
}

function removeBranchFilesFromFs(siteId: string, branch: Branch, redirects: Redirect<FileRedirectConfig>[]) {
  return Promise.all(redirects.map(async redirect => {
    const path = getBranchFilePath(siteId, branch._id, redirect);
    try {
      await promises.unlink(path);
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e;
      }
    }
  }));
}

const validators = [
  params(object({
    siteId: $id,
    branchId: string().required(),
  })),
  body(object({
    redirects: array().required().min(0).max(ARRAY_MAX)
      .items($redirect)
      .unique((a: Redirect, b: Redirect) => a.path === b.path),
  })),
];

const logger = new Logger('meli.api:setBranchRedirects');

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId } = req.params;
  const { redirects } = req.body;

  const site = await Sites().findOne({
    _id: siteId,
  });
  const branch = site.branches.find(brch => brch._id === branchId);
  const removedRedirects = !branch.redirects ? [] : branch.redirects.filter(existingRedirect => (
    redirects.every(redirect => redirect.path !== existingRedirect.path)
  ));

  await Sites().updateOne(
    {
      _id: siteId,
      'branches._id': branchId,
    },
    {
      $set: {
        'branches.$.redirects': redirects,
      },
    },
  );

  await storeBranchFilesToFs(
    siteId,
    branch,
    redirects.filter(r => r.type === RedirectType.file),
  );
  await removeBranchFilesFromFs(
    siteId,
    branch,
    removedRedirects.filter(r => r.type === RedirectType.file) as Redirect<FileRedirectConfig>[],
  );

  // do this in memory to avoid querying db again
  branch.redirects = redirects;

  updateBranchInCaddy(site, branch).catch(err => {
    logger.error(err);
  });

  emitEvent(EventType.site_branch_redirects_set, {
    site,
    branch,
  });

  res.json(redirects.map(channelEnv => (
    serializeRedirect(site, branch, channelEnv)
  )));
}

export const setBranchRedirects = [
  ...branchExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
