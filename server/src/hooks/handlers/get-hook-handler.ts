import { Hook, HookType } from '../hook';
import { EventData } from '../../events/event-data';
import { handleEmailHook } from './email/handle-email-hook';
import { handleMattermostHook } from './mattermost/handle-mattermost-hook';
import { handleSlackHook } from './slack/handle-slack-hook';
import { handleWebHook } from './web/handle-web-hook';
import { AppError } from '../../commons/errors/app-error';

export interface HookDeliveryResult<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

export type GetHookHandler<K extends keyof EventData = any, Config = any> = (
  hook: Hook<Config>,
  event: K,
  data: EventData[K],
) => Promise<HookDeliveryResult>;

export function getHookHandler(type: HookType): GetHookHandler {
  switch (type) {
    case HookType.email:
      return handleEmailHook;
    case HookType.mattermost:
      return handleMattermostHook;
    case HookType.slack:
      return handleSlackHook;
    case HookType.web:
      return handleWebHook;
    default:
      throw new AppError(`Unsupported hook type ${type}`);
  }
}
