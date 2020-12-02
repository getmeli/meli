import { object, string } from 'joi';
import { env } from '../../../env';
import { emails } from '../../../emails/emails';
import { EventType } from '../../../events/app-event';
import { Hook } from '../../hook';
import { HookDeliveryResult } from '../get-hook-handler';

interface EmailHookConfig {
  to: string;
}

export const $emailHookConfig = object<EmailHookConfig>({
  to: string().required(),
});

export async function handleEmailHook(
  { config }: Hook<EmailHookConfig>,
  event: EventType,
  data: any,
): Promise<HookDeliveryResult> {
  try {
    // https://nodemailer.com/message/
    const content = 'No custom handler set for this event, sending empty data to prevent leaking sensistive information';
    await emails.sendMail({
      from: env.MELI_MAIL_FROM,
      to: config.to,
      subject: `Meli event: ${event}`,
      html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <title>Meli event: ${event}</title>
  </head>
  <body>
  <pre><code>${content}</code></pre>
  </body>
  </html>
  `,
      text: `
  ${content}
  `,
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
