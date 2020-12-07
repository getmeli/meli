import { Logger } from '../commons/logger/logger';
import { hookEventHandler } from '../hooks/hook-event-handler';
import { socketEventHandler } from '../socket/socket-event-handler';
import { EventData } from './event-data';

const logger = new Logger('meli.api:emitEvent');

export function emitEvent<T extends keyof EventData>(type: T, data: EventData[T]): void {
  logger.debug(type, data);
  hookEventHandler(type, data);
  // ui feedback, live list updates etc
  socketEventHandler(type, data);
}
