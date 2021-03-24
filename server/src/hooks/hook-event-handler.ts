import { Hook, Hooks } from './hook';
import { deliverHook } from './deliver-hook';
import { Logger } from '../commons/logger/logger';
import { EventData } from '../events/event-data';
import { getHooksForEvent } from './get-hooks-for-event';

const logger = new Logger('meli.api:hookEventHandler');

function deliverHooks<T extends keyof EventData>(hooks: Hook[], eventType: T, data: EventData[T]): void {
  hooks.forEach(hook => {
    deliverHook(hook, eventType, data)
      .then(() => {
        logger.debug('Hook handled', hook, eventType, data);
      })
      .catch(err => {
        logger.error(err);
      });
  });
}

export function hookEventHandler<T extends keyof EventData>(type: T, data: EventData[T]): void {
  getHooksForEvent(type, data)
    .then(hookIds => (
      Hooks()
        .find({
          _id: {
            $in: hookIds,
          },
          events: type,
        })
        .toArray()
    ))
    .then(hooks => {
      deliverHooks(hooks, type, data);
    })
    .catch(err => {
      logger.error(err);
    });
}
