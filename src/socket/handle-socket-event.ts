import { EventData } from '../events/event-data';
import { Logger } from '../commons/logger/logger';
import { messageBuilders } from './message-builders';
import { Io } from './create-io-server';

const logger = new Logger('meli.api:handleSocketEvent');

export function handleSocketEvent<T extends keyof EventData>(eventType: T, data: EventData[T]): void {
  const messageBuilder = messageBuilders[eventType];

  if (!messageBuilder) {
    logger.debug('no message builder for', eventType);
  }

  const { room, data: serializedData } = messageBuilder(data);

  Io.server.to(room).emit(eventType, serializedData);
}
