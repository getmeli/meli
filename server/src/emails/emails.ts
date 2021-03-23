import nodemailer, { SentMessageInfo, TransportOptions } from 'nodemailer';
import { env } from '../env/env';
import Mail from 'nodemailer/lib/mailer';
import { Logger } from '../commons/logger/logger';
import chalk from 'chalk';

const logger = new Logger('meli.api:emails');

let transporter: {
  /**
   * https://nodemailer.com/message/
   * @param mailOptions
   */
  sendMail(mailOptions: Mail.Options): Promise<SentMessageInfo>;
};

if (env.MELI_MAIL_HOST && env.MELI_MAIL_PORT) {
  logger.debug('Emails are configured');
  // https://nodemailer.com/smtp/#general-options
  transporter = nodemailer.createTransport(<TransportOptions>{
    host: env.MELI_MAIL_HOST,
    port: env.MELI_MAIL_PORT,
    auth: env.MELI_MAIL_USERNAME && env.MELI_MAIL_PASSWORD ? {
      user: env.MELI_MAIL_USERNAME,
      pass: env.MELI_MAIL_PASSWORD,
    } : undefined,
  });
} else {
  logger.warn(`Emails are ${chalk.red('disabled')}, will print to console`);
  transporter = {
    async sendMail(mailOptions: Mail.Options): Promise<SentMessageInfo> {
      logger.info('email', JSON.stringify(mailOptions, null, 2));
    },
  };
}

export const emails = transporter;
