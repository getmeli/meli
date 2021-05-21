import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { object, string } from 'joi';
import { query } from '../../../../commons/express-joi/query';
import { Sites } from '../../../sites/site';
import { params } from '../../../../commons/express-joi/params';
import { canReadProjectGuard } from '../../guards/can-read-project-guard';
import { projectExistsGuard } from '../../guards/project-exists-guard';
import { serializeSite } from '../../../sites/serialize-site';

const validators = [
  params(object({
    projectId: string().optional(),
  })),
  query(object({
    search: string().optional().min(3).max(255),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { projectId } = req.params;

  const sites = await Sites()
    .find({
      projectId,
    })
    .sort({
      updatedAt: -1,
    })
    .toArray();

  res.json(sites.map(serializeSite));
}

export const listProjectSites = [
  ...projectExistsGuard,
  ...canReadProjectGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
