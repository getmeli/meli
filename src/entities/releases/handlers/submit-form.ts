import { Handler, Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../../commons/utils/wrap-async-middleware';
import { sendEmail } from '../../../emails/send-email';
import { validateCaptcha } from '../guards/validate-captcha';
import { Sites } from '../../sites/site';
import { NotFoundError } from '../../../commons/errors/not-found-error';
import { AppError } from '../../../commons/errors/app-error';
import { Releases } from '../release';
import { EmailForm } from '../../forms/form';
import multer from 'multer';
import { env } from '../../../env/env';

function submitEmailForm(form: EmailForm, formData: any, files: Express.Multer.File[]): Promise<void> {
  if (!form.recipient) {
    throw new AppError('Recipient not defined');
  }
  console.log(files);
  return sendEmail(
    [form.recipient],
    `Form submission - ${form.name}`,
    'form-submission',
    {
      formName: form.name,
      formData: JSON.stringify(formData, null, 2),
    },
    files.map(upload => ({
      filename: `${upload.fieldname}_${upload.originalname}`,
      path: upload.path,
      encoding: upload.encoding,
      contentType: upload.mimetype,
    })),
  );
}

async function handler(req: Request, res: Response): Promise<void> {
  const { siteId, branchId, formName } = req.params;

  const site = await Sites().findOne({
    _id: siteId,
    'branches._id': branchId,
  });

  if (!site) {
    throw new NotFoundError('Site not found');
  }

  const branch = site.branches.find(b => b._id === branchId);

  if (!branch.release) {
    throw new AppError('Branch has no release, will not be able to find form');
  }

  const release = await Releases().findOne({ _id: branch.release });

  if (!release) {
    throw new NotFoundError('Release not found');
  }

  const form = release.forms.find(({ name }) => name === formName);

  if (!form) {
    throw new NotFoundError('Form not found');
  }

  const formData = req.body;
  const files = req.files as Express.Multer.File[];

  switch (form.type) {
    case 'email':
      await submitEmailForm(form, formData, files);
      break;
    default:
      throw new AppError('Unknown form type', { type: form.type });
  }

  res.status(204).send();
}

const upload = multer({
  dest: env.MELI_STORAGE_DIR,
  limits: env.MELI_MULTER_FORM_LIMITS,
});

export const submitForm: Handler[] = [
  validateCaptcha,
  upload.any(),
  wrapAsyncMiddleware(handler),
];
