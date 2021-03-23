export function listenMany(
  socket: SocketIOClient.Socket,
  listeners: {
    event: string;
    listener: any;
  }[],
): () => void | undefined {
  if (socket) {
    listeners.forEach(({ event, listener }) => {
      socket.on(event, listener);
    });
    return () => {
      listeners.forEach(({ event, listener }) => {
        socket.removeListener(event, listener);
      });
    };
  }
}
