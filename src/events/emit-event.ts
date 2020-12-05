import { Logger } from '../commons/logger/logger';
import { hookEventHandler } from '../hooks/hook-event-handler';
import { socketEventHandler } from '../socket/socket-event-handler';
import { AppEventData } from './app-event-data';

const logger = new Logger('meli.api:emitEvent');

export function emitEvent<T extends keyof AppEventData>(type: T, data: AppEventData[T]): void {
  logger.debug(type, data);
  hookEventHandler(type, data);
  // ui feedback, live list updates etc
  socketEventHandler(type, data);
}
