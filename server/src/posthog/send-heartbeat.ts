import { postHog, postHogId } from './posthog';
import { Logger } from '../commons/logger/logger';

const logger = new Logger('app.posthog:sendHeartbeat');

export function sendHeartbeat() {
  logger.debug('sending heartbeat');
  postHog.capture({
    event: 'heartbeat',
    distinctId: postHogId.id,
    properties: {
      version: BUILD_INFO.version,
    },
  });
}
