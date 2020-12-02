import { Hook } from '../../hook';
import { EventType } from '../../../events/app-event';
import { sendMattermostMessage } from './send-mattermost-message';
import { HookDeliveryResult } from '../get-hook-handler';

export function handleMattermostHook(hook: Hook, eventType: EventType, data: any): Promise<HookDeliveryResult> {
  switch (eventType) {
    default:
      return sendMattermostMessage(hook.config, eventType, {
        username: 'meli.sh',
        icon_url: 'https://raw.githubusercontent.com/gomeli/meli-brand/master/logo/meli-logo.svg',
        text: 'No custom handler set for this event, sending empty data to prevent leaking sensistive information',
        branch: undefined,
      });
  }
}
