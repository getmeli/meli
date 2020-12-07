import { Hook } from '../../hook';
import { EventType } from '../../../events/event-type';
import { deliverWebHook } from './deliver-web-hook';
import { getPayload } from './get-payload';

export function handleWebHook(hook: Hook, eventType: EventType, data: any) {
  const payloadFn = getPayload[eventType];
  const payload = payloadFn ? payloadFn(data) : {
    eventType,
    data: {
      message: 'No custom handler set for this event, sending empty data to prevent leaking sensistive information',
    },
  };
  return deliverWebHook(hook.config, eventType, payload);
}
