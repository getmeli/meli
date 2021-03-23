import { Request, Response } from 'express';
import { $formArrayItem } from '../../forms/form';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { body } from '../../../commons/express-joi/body';
import { serializeForm } from '../../forms/serialize-form';
import { array, object } from 'joi';
import { Releases } from '../release';
import { canAdminReleaseGuard } from '../guards/can-admin-release-guard';

const validators = [
  body(object({
    forms: array().optional().items(
      $formArrayItem,
    ),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { releaseId } = req.params;

  await Releases().updateOne({
    _id: releaseId,
  }, {
    $set: {
      forms: req.body.forms,
    },
  });

  const release = await Releases().findOne({ _id: releaseId });

  // emitEvent(EventType.form_updated, {
  //   form,
  // });

  res.json(release.forms?.map(serializeForm) || []);
}

export const updateForms = [
  ...validators,
  ...canAdminReleaseGuard,
  wrapAsyncMiddleware(handler),
];
