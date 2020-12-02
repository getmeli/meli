import { AppEventData } from '../events/app-event-data';

// const logger = new Logger('meli.server:socketEventHandler');

export function socketEventHandler<T extends keyof AppEventData>(type: T, data: AppEventData[T]): void {
  // logger.debug('emit event', event, 'to room', room);
  // TODO handle websocket
  // TODO handle hooks
  // io.to(room).emit(`${room}.${event}`, data);
}
