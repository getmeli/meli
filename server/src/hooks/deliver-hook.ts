import { Logger } from '../commons/logger/logger';
import { getHookHandler } from './handlers/get-hook-handler';
import { uuid } from '../utils/uuid';
import { HookDeliveries, HookDelivery } from './hook-delivery';
import { Hook } from './hook';
import { EventData } from '../events/event-data';

const logger = new Logger('meli.api:notify');

export async function deliverHook<EventType extends keyof EventData>(
  hook: Hook,
  eventType: EventType,
  eventData: EventData[EventType],
): Promise<HookDelivery> {
  const delivery: HookDelivery = {
    _id: uuid(),
    type: hook.type,
    hookId: hook._id,
    date: new Date(),
    success: undefined,
  };

  const deliver = getHookHandler(hook.type);

  try {
    const {
      success, error, data,
    } = await deliver(hook, eventType, eventData);
    delivery.success = success;
    delivery.error = error;
    delivery.data = data;
  } catch (err) {
    delivery.success = false;
    delivery.error = err.message;
  }

  await HookDeliveries().insertOne(delivery);

  logger.debug('delivered hook', delivery);

  return delivery;
}
