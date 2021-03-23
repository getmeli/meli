import { Logger } from '../commons/logger/logger';
import { hookEventHandler } from '../hooks/hook-event-handler';
import { handleSocketEvent } from '../socket/handle-socket-event';
import { EventData } from './event-data';

const logger = new Logger('meli.api:emitEvent');

export function emitEvent<T extends keyof EventData>(type: T, data: EventData[T]): void {
  logger.debug(type, data);
  hookEventHandler(type, data);
  handleSocketEvent(type, data);
}
