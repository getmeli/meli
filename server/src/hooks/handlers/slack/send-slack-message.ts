import { object, string } from 'joi';
import { env } from '../../../env/env';
import { EventType } from '../../../events/event-type';
import axios from 'axios';
import { HookDeliveryResult } from '../get-hook-handler';

interface SlackHookConfig {
  url: string;
}

export const $slackHookConfig = object<SlackHookConfig>({
  url: string().required(),
});

export async function sendSlackMessage(
  config: SlackHookConfig,
  event: EventType,
  // https://api.slack.com/messaging/webhooks
  message: any,
): Promise<HookDeliveryResult> {
  try {
    await axios.post(config.url, {
      data: message,
      headers: {
        'Content-type': 'application/json',
      },
      timeout: env.MELI_HOOK_TIMEOUT,
    });
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
  return {
    success: true,
  };
}
