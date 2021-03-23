import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import openSocket from 'socket.io-client';
import { useEnv } from '../providers/EnvProvider';

export const SocketContext = createContext<SocketIOClient.Socket>(undefined);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider(props) {
  const env = useEnv();

  const socketRef = useRef<SocketIOClient.Socket>();
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    const url = new URL(env.MELI_API_URL);
    const sock: SocketIOClient.Socket = openSocket(env.MELI_API_URL, {
      path: `${url.pathname}/socket.io`.replace(/\/+/g, '/'),
    });
    socketRef.current = sock;
    setSocket(sock);
  }, [env]);

  return <SocketContext.Provider value={socket} {...props} />;
}
