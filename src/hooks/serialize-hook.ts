import { Hook } from './hook';

export function serializeHook(hook: Hook) {
  return {
    _id: hook._id,
    type: hook.type,
    name: hook.name,
    createdAt: hook.createdAt,
    updatedAt: hook.updatedAt,
    // TODO custom config serializer per type ?
    // TODO might not want to leak these secrets into webhooks and events ?
    config: hook.config,
    events: hook.events,
  };
}
