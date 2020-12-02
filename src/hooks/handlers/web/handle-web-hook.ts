import { Hook } from '../../hook';
import { EventType } from '../../../events/app-event';
import { deliverWebHook } from './deliver-web-hook';

export function handleWebHook(hook: Hook, eventType: EventType, data: any) {
  switch (eventType) {
    default:
      return deliverWebHook(hook.config, eventType, {
        eventType,
        data: {
          message: 'No custom handler set for this event, sending empty data to prevent leaking sensistive information',
        },
      });
  }
}
