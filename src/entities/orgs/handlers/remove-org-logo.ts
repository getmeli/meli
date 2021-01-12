import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { emitEvent } from '../../../events/emit-event';
import { object } from 'joi';
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
];

async function handler(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;

  await Orgs().updateOne({
    _id: orgId,
  }, {
    $unset: {
      logo: 1,
    },
  });

  const org = await Orgs().findOne({
    _id: orgId,
  });

  emitEvent(EventType.org_logo_removed, {
    org,
  });

  res.json(serializeOrg(org));
}

export const removeOrgLogo = [
  ...orgExistsGuard,
  ...canWriteOrgGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
