import { EventData } from '../events/event-data';

// const logger = new Logger('meli.api:socketEventHandler');

export function socketEventHandler<T extends keyof EventData>(type: T, data: EventData[T]): void {
  // logger.debug('emit event', event, 'to room', room);
  // TODO handle websocket
  // TODO handle hooks
  // io.to(room).emit(`${room}.${event}`, data);
}
