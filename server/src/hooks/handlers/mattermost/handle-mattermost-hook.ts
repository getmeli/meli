import { Hook } from '../../hook';
import { EventType } from '../../../events/event-type';
import { sendMattermostMessage } from './send-mattermost-message';
import { HookDeliveryResult } from '../get-hook-handler';
import { getMessageForEvent } from '../slack/get-message-for-event';
import { getMattermostMessage } from './get-mattermost-message';

export function handleMattermostHook(hook: Hook, eventType: EventType, data: any): Promise<HookDeliveryResult> {
  const getMessageFn = getMessageForEvent[eventType];
  const message = getMessageFn
    ? getMessageFn(data)
    : getMattermostMessage('No custom handler set for this event, sending empty data to prevent leaking sensistive information');
  return sendMattermostMessage(hook.config, eventType, message);
}
