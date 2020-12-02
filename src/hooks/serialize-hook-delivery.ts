import { HookDelivery } from './hook-delivery';

export function serializeHookDelivery(delivery: HookDelivery) {
  return {
    _id: delivery._id,
    hookId: delivery.hookId,
    date: delivery.date,
    data: delivery.data,
    success: delivery.success,
    error: delivery.error,
  };
}
