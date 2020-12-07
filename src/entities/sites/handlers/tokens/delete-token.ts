import { Request, Response } from 'express';
import { object, string } from 'joi';
import { siteExistsGuard } from '../../guards/site-exists-guard';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Sites } from '../../site';
import { params } from '../../../../commons/express-joi/params';
import { emitEvent } from '../../../../events/emit-event';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { $id } from '../../../../utils/id';
import { EventType } from '../../../../events/event-type';

const validators = [
  params(object({
    siteId: $id,
    tokenId: string().required(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, tokenId } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
  });
  const token = site.tokens.find(({ _id }) => _id === tokenId);

  await Sites().updateOne({
    _id: siteId,
  }, {
    $pull: {
      tokens: {
        _id: tokenId,
      },
    },
  });

  emitEvent(EventType.site_token_deleted, {
    site,
    token,
  });

  res.status(204).send();
}

export const deleteToken = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
