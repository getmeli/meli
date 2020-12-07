import { EventType } from '../../../events/event-type';
import { Hook } from '../../hook';
import { HookDeliveryResult } from '../get-hook-handler';
import { getMessageForEvent } from './get-message-for-event';
import { EmailHookConfig, EmailHookMessage, sendEmailHook } from './send-email-hook';

function defaultEmailMessage(eventType: EventType) {
  return {
    subject: `Meli event: ${eventType}`,
    text: 'No custom handler set for this event, sending empty data to prevent leaking sensistive information',
  };
}

export async function handleEmailHook(
  hook: Hook<EmailHookConfig>,
  eventType: EventType,
  data: any,
): Promise<HookDeliveryResult> {
  const getMessageFn = getMessageForEvent[eventType];
  const message: EmailHookMessage = getMessageFn ? getMessageFn(data) : defaultEmailMessage(eventType);
  return sendEmailHook(hook.config, message);
}
