import path from 'path';
import { promises } from 'fs';
import { AppError } from '../commons/errors/app-error';
import { emails } from './emails';
import { compile, TemplateDelegate } from 'handlebars';
import { env } from '../env/env';
import { Logger } from '../commons/logger/logger';

const logger = new Logger('meli.api:sendEmailTemplate');

export async function sendEmail(
  to: string[],
  subject: string,
  templateName: string,
  templateVariables: { [key: string]: any },
): Promise<void> {
  const templatePath = path.resolve(env.MELI_MAIL_TEMPLATE_DIR, `${templateName}.hbs`);

  let stat: any;
  try {
    stat = await promises.stat(templatePath);
  } catch (e) {
    logger.error(e);
  }

  if (!stat) {
    throw new AppError(`Unknown template ${templateName}`);
  }

  const template: string = (await promises.readFile(templatePath)).toString();

  const compiledTemplate: TemplateDelegate = compile(template);
  const text = compiledTemplate(templateVariables);

  await Promise.all(
    to.map(async email => {
      await emails.sendMail({
        from: env.MELI_MAIL_FROM,
        to: email,
        subject: `${env.MELI_MAIL_SUBJECT_PREFIX} ${subject}`,
        text,
      });
    }),
  );
}
