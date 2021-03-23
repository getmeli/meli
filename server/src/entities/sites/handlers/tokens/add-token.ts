import { Request, Response } from 'express';
import { siteExistsGuard } from '../../guards/site-exists-guard';
import { object, string } from 'joi';
import { STRING_MAX_LENGTH } from '../../../../constants';
import { wrapAsyncMiddleware } from '../../../../commons/utils/wrap-async-middleware';
import { Sites, SiteToken } from '../../site';
import { body } from '../../../../commons/express-joi/body';
import { serializeSiteToken } from '../../serialize-site-token';
import { emitEvent } from '../../../../events/emit-event';
import { canAdminSiteGuard } from '../../guards/can-admin-site-guard';
import { uuid } from '../../../../utils/uuid';
import { params } from '../../../../commons/express-joi/params';
import { $id } from '../../../../utils/id';
import { EventType } from '../../../../events/event-type';
import { generateTokenValue } from '../../../../utils/generate-token-value';

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

  const token: SiteToken = {
    _id: uuid(),
    value: generateTokenValue(),
    createdAt: new Date(),
    name: req.body.name,
  };

  await Sites().updateOne({
    _id: siteId,
  }, {
    $push: {
      tokens: token,
    },
  });

  emitEvent(EventType.site_token_added, {
    site: await Sites().findOne({
      _id: siteId,
    }),
    token,
  });

  res.json(serializeSiteToken(token));
}

export const addToken = [
  ...siteExistsGuard,
  ...canAdminSiteGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
