import axios from 'axios';
import { env } from '../../../env';
import { object, string } from 'joi';
import { EventType } from '../../../events/app-event';

interface MattermostHookConfig {
  // https://docs.mattermost.com/developer/webhooks-incoming.html#simple-incoming-webhook
  url: string;
}

export const $mattermostHookConfig = object<MattermostHookConfig>({
  url: string().required(),
});

// TODO use handlebars + template file ?
export async function sendMattermostMessage(
  config: MattermostHookConfig,
  event: EventType,
  // https://docs.mattermost.com/developer/webhooks-incoming.html#simple-incoming-webhook
  message: any,
): Promise<any> {
  try {
    // https://developers.mattermost.com/integrate/incoming-webhooks/
    await axios.post(
      config.url,
      message,
      {
        headers: {
          'Content-type': 'application/json',
        },
        timeout: env.MELI_HOOK_TIMEOUT,
      },
    );
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
