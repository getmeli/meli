import { useEffect } from 'react';
import { useSocket } from './SocketProvider';
import { EventType } from './event-type';

const CONNECT_EVENT = 'connect';

const roomListeners = new Map<string, number>();

export function useRoom<T>(
  room: string,
  entityId: string,
  eventTypes: EventType[],
  cb: (t: T) => void,
): void {
  const socket = useSocket();

  // join room
  useEffect(() => {
    if (!socket) {
      return;
    }

    const roomKey = `${room}.${entityId}`;

    if (roomListeners.has(roomKey)) {
      // already joined, just increase listeners
      roomListeners.set(roomKey, roomListeners.get(roomKey) + 1);
      return;
    }

    roomListeners.set(roomKey, 1);

    const join = () => {
      socket.emit(`join.${room}`, entityId);
    };

    join();

    socket.on(CONNECT_EVENT, join);

    return () => {
      socket.removeListener(CONNECT_EVENT, join);
      // don't leave room while other listeners are still active
      if (roomListeners.get(roomKey) <= 1) {
        socket.emit(`leave.${room}`, entityId);
        roomListeners.delete(roomKey);
      }
    };
  }, [socket, entityId, room]);

  // listen to event
  useEffect(() => {
    if (!socket) {
      return;
    }

    eventTypes.forEach(eventType => {
      socket.on(eventType, cb);
    });

    return () => {
      eventTypes.forEach(eventType => {
        socket.removeListener(eventType, cb);
      });
    };
  }, [socket, entityId, eventTypes, cb]);
}
