import { env } from '../../../env/env';
import { emails } from '../../../emails/emails';
import { HookDeliveryResult } from '../get-hook-handler';
import { object, string } from 'joi';

export interface EmailHookConfig {
  to: string;
}

export const $emailHookConfig = object<EmailHookConfig>({
  to: string().required(),
});

export interface EmailHookMessage {
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmailHook(
  config: EmailHookConfig,
  message: EmailHookMessage,
): Promise<HookDeliveryResult> {
  try {
    await emails.sendMail({
      from: env.MELI_MAIL_FROM,
      to: config.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
  return {
    success: true,
  };
}
