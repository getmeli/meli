import nodemailer, { Transporter, TransportOptions } from 'nodemailer';
import { env } from '../env';

// https://nodemailer.com/smtp/#general-options
export const emails: Transporter = nodemailer.createTransport(<TransportOptions>{
  host: env.MELI_MAIL_HOST,
  port: env.MELI_MAIL_PORT,
  auth: env.MELI_MAIL_USERNAME && env.MELI_MAIL_PASSWORD ? {
    user: env.MELI_MAIL_USERNAME,
    pass: env.MELI_MAIL_PASSWORD,
  } : undefined,
});
