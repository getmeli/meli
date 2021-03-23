import { sendSlackMessage } from './send-slack-message';
import { Hook } from '../../hook';
import { EventType } from '../../../events/event-type';
import { HookDeliveryResult } from '../get-hook-handler';
import { getMessageForEvent } from './get-message-for-event';
import { getSlackMessage } from './get-slack-message';

export function handleSlackHook(hook: Hook, eventType: EventType, data: any): Promise<HookDeliveryResult> {
  const getMessageFn = getMessageForEvent[eventType];
  const message = getMessageFn ? getMessageFn(data) : getSlackMessage(
    `Meli event: ${eventType}`,
    'No custom handler set for this event, sending empty data to prevent leaking sensistive information',
  );
  return sendSlackMessage(hook.config, eventType, message);
}
