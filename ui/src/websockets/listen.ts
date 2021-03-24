export function listen(socket: SocketIOClient.Socket, event: string, listener: any): () => void | undefined {
  if (socket) {
    socket.on(event, listener);
    return () => {
      socket.removeListener(event, listener);
    };
  }
}
