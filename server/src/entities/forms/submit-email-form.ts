import { EmailForm } from './form';
import { AppError } from '../../commons/errors/app-error';
import { sendEmail } from '../../emails/send-email';

export function submitEmailForm(form: EmailForm, formData: any, files: Express.Multer.File[]): Promise<void> {
  if (!form.recipient) {
    throw new AppError('Recipient not defined');
  }
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
