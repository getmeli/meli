export function emitNowAndOnReconnect(
  socket: SocketIOClient.Socket,
  emit: () => any,
): (() => void) | undefined {
  if (socket) {
    emit();
    const event = 'connect';
    const listener = () => {
      emit();
    };
    socket.on(event, listener);
    return () => {
      socket.removeListener(event, listener);
    };
  }
}
