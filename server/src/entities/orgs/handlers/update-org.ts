import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { body } from '../../../commons/express-joi/body';
import { emitEvent } from '../../../events/emit-event';
import { object, string } from 'joi';
import { COLOR_PATTERN, STRING_MAX_LENGTH } from '../../../constants';
import { Orgs } from '../org';
import { serializeOrg } from '../serialize-org';
import { canWriteOrgGuard } from '../guards/can-write-org-guard';
import { orgExistsGuard } from '../guards/org-exists-guard';
import { EventType } from '../../../events/event-type';
import { params } from '../../../commons/express-joi/params';
import { $id } from '../../../utils/id';

const validators = [
  params(object({
    orgId: $id,
  })),
  body(object({
    name: string().required().max(STRING_MAX_LENGTH),
    color: string().required().regex(COLOR_PATTERN),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;

  await Orgs().updateOne(
    {
      _id: orgId,
    },
    {
      $set: {
        updatedAt: new Date(),
        name: req.body.name,
        color: req.body.color,
      },
    },
  );

  const org = await Orgs().findOne({
    _id: orgId,
  });

  emitEvent(EventType.org_updated, {
    org,
  });

  res.json(serializeOrg(org));
}

export const updateOrg = [
  ...orgExistsGuard,
  ...canWriteOrgGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
