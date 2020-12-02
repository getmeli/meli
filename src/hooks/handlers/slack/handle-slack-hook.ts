import { sendSlackMessage } from './send-slack-message';
import { Hook } from '../../hook';
import { EventType } from '../../../events/app-event';
import { HookDeliveryResult } from '../get-hook-handler';

export function handleSlackHook(hook: Hook, eventType: EventType, data: any): Promise<HookDeliveryResult> {
  switch (eventType) {
    default:
      return sendSlackMessage(hook.config, eventType, {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Meli event: ${eventType}`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'No custom handler set for this event, sending empty data to prevent leaking sensistive information',
            },
          },
        ],
      });
  }
}
