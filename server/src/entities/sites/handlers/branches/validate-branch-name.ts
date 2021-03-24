import { Request, Response } from 'express';
import { object, string } from 'joi';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Sites } from '../../site';
import { STRING_MAX_LENGTH } from '../../../../constants';
import { body } from '../../../../commons/express-joi/body';
import { siteExistsGuard } from '../../guards/site-exists-guard';
import { params } from '../../../../commons/express-joi/params';
import { $id } from '../../../../utils/id';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { slugify } from '../../../../utils/slugify';

const validators = [
  params(object({
    siteId: $id,
  })),
  body(object({
    name: string().required().max(STRING_MAX_LENGTH),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId } = req.params;
  const { name } = req.body;
  const slug = slugify(name);

  const count = await Sites().countDocuments({
    _id: siteId,
    'branches.slug': slug,
  }, {
    limit: 1,
  });

  res.json(count !== 0 ? 'Branch name already exists' : undefined);
}

export const validateBranchName = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
