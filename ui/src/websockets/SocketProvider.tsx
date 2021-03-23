import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import openSocket from 'socket.io-client';

export const SocketContext = createContext<SocketIOClient.Socket>(undefined);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider(props) {

  const socketRef = useRef<SocketIOClient.Socket>();
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    const sock: SocketIOClient.Socket = openSocket('/');
    socketRef.current = sock;
    setSocket(sock);
  }, []);

  return <SocketContext.Provider value={socket} {...props} />;
}
